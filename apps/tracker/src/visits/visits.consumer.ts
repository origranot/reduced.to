import { Injectable } from '@nestjs/common';
import { ConsumerService } from '@reduced.to/queue-manager';
import { AppConfigService } from '@reduced.to/config';
import { AppLoggerService } from '@reduced.to/logger';
import { createHash } from 'node:crypto';
import { KafkaMessage } from 'kafkajs';
import { isbot } from 'isbot';
import geoip from 'geoip-lite';
import { VisitsService } from './visits.service';
import { PrismaService } from '@reduced.to/prisma';
import { UsageService } from '@reduced.to/subscription-manager';

@Injectable()
export class VisitsConsumer extends ConsumerService {
  constructor(
    config: AppConfigService,
    private readonly loggerService: AppLoggerService,
    private readonly prismaService: PrismaService,
    private readonly visitsService: VisitsService,
    private readonly usageService: UsageService
  ) {
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

    const user = await this.prismaService.link.findUnique({
      where: { key },
      select: {
        userId: true,
      },
    });

    if (!user) {
      this.loggerService.debug('Could not find user id for key: ', key);
      return;
    }

    const isEligleToTrackClick = await this.usageService.isEligibleToTrackClicks(user.userId);

    if (!isEligleToTrackClick) {
      this.loggerService.debug('User has reached the limit of tracked clicks');
      return;
    }

    const hashedIp = createHash('sha256').update(ip).digest('hex');
    const isUniqueVisit = await this.visitsService.isUnique(key, hashedIp);

    if (!isUniqueVisit) {
      return;
    }

    if (isbot(userAgent)) {
      this.loggerService.debug(`Bot detected for ${key} and user agent: ${userAgent}, skipping...`);
      return;
    }

    const geoLocation = geoip.lookup(ip);
    this.loggerService.debug(`Parsed ip ${ip} to geo location: ${JSON.stringify(geoLocation)}`);

    await Promise.all([
      this.visitsService.add(key, {
        hashedIp,
        ua: userAgent,
        geoLocation,
      }),
      this.usageService.incrementClicksCount(user.userId),
    ]);

    this.loggerService.log(`Added unique visit for ${key}`);
  }
}
