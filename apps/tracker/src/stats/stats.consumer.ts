import { Injectable } from '@nestjs/common';
import { ConsumerService } from '@reduced.to/queue-manager';
import { AppConfigService } from '@reduced.to/config';
import { AppLoggerService } from '@reduced.to/logger';
import { StatsService } from './stats.service';
import { createHash } from 'node:crypto';
import { KafkaMessage } from 'kafkajs';
import geoip from 'geoip-lite';

@Injectable()
export class StatsConsumer extends ConsumerService {
  constructor(config: AppConfigService, private readonly loggerService: AppLoggerService, private readonly statsService: StatsService) {
    super(config.getConfig().tracker.stats.topic);
  }

  async onMessage(_topic: string, _partition: number, message: KafkaMessage) {
    const { ip, userAgent, key } = JSON.parse(message.value.toString()) as {
      ip: string;
      userAgent: string;
      key: string;
      url: string;
    };

    this.loggerService.debug(`Received message for ${key} with ip: ${ip} and user agent: ${userAgent}`);

    const hashedIp = createHash('sha256').update(ip).digest('hex');
    const isUniqueVisit = await this.statsService.isUniqueVisit(key, hashedIp);

    if (!isUniqueVisit) {
      return;
    }

    let geoLocation = null;
    try {
      geoLocation = geoip.lookup(ip);
      this.loggerService.debug(`Parsed ip ${ip} to geo location: ${JSON.stringify(geoLocation)}`);
    } catch (err) {
      this.loggerService.error(`Failed to parse geo location for ${key} with error: ${err.message}`);
    }

    await this.statsService.addVisit(key, {
      hashedIp,
      ua: userAgent,
      ...(geoLocation && { geoLocation }),
    });

    this.loggerService.log(`Added unique visit for ${key}`);
  }
}
