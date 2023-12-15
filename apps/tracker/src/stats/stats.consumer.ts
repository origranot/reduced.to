import { Injectable } from '@nestjs/common';
import { ConsumerService } from '@reduced.to/queue-manager';
import { AppConfigService } from '@reduced.to/config';
import { AppLoggerSerivce } from '@reduced.to/logger';
import { StatsService } from './stats.service';
import { createHash } from 'node:crypto';
import { Message } from 'memphis-dev/*';

@Injectable()
export class StatsConsumer extends ConsumerService {
  constructor(config: AppConfigService, private readonly loggerService: AppLoggerSerivce, private readonly statsService: StatsService) {
    super('tracker', config.getConfig().tracker.stats.queueName);
  }

  async onMessage(message: Message): Promise<void> {
    const { ip, userAgent, key, geo, url } = message.getDataAsJson() as {
      ip: string;
      userAgent: string;
      key: string;
      url: string;
      geo: string;
    };

    const hashedIp = createHash('sha256').update(ip).digest('hex');
    const isUniqueVisit = await this.statsService.isUniqueVisit(key, hashedIp);

    if (!isUniqueVisit) {
      return;
    }

    let geoLocation = null;
    try {
      geoLocation = JSON.parse(geo);
    } catch (err) {
      this.loggerService.error(`Failed to parse geo location for ${key} with error: ${err.message}`);
    }

    await this.statsService.addVisit(key, {
      hashedIp,
      ua: userAgent,
      ...(geoLocation?.status === 'success' && geoLocation),
    });

    message.ack();
    this.loggerService.log(`Added unique visit for ${key}`);
  }
}
