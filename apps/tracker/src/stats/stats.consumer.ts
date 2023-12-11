import { Injectable } from '@nestjs/common';
import { ConsumerService } from '@reduced.to/queue-manager';
import { AppConfigService } from '@reduced.to/config';
import { AppLoggerSerivce } from '@reduced.to/logger';
import { StatsService } from './stats.service';
import * as geoip from 'geoip-lite';
import { createHash } from 'node:crypto';
import { Message } from 'memphis-dev/*';

@Injectable()
export class StatsConsumer extends ConsumerService {
  constructor(config: AppConfigService, private readonly loggerService: AppLoggerSerivce, private readonly statsService: StatsService) {
    super('tracker', config.getConfig().tracker.stats.queueName);
  }

  async onMessage(message: Message): Promise<void> {
    const { ip, userAgent, key, url } = message.getDataAsJson() as { ip: string; userAgent: string; key: string; url: string };
    message.ack();

    const hashedIp = createHash('sha256').update(ip).digest('hex');
    const isUniqueVisit = await this.statsService.isUniqueVisit(key, hashedIp);

    if (!isUniqueVisit) {
      return;
    }

    const geo = geoip.lookup(ip);
    await this.statsService.addVisit(key, {
      hashedIp,
      ua: userAgent,
      geo,
    });

    this.loggerService.log(`Added unique visit for ${key}`);
  }
}
