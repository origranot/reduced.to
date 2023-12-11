import { Injectable } from '@nestjs/common';
import { ConsumerService } from '@reduced.to/queue-manager';
import { AppConfigService } from '@reduced.to/config';

@Injectable()
export class StatsConsumer extends ConsumerService {
  constructor(config: AppConfigService) {
    super('tracker', config.getConfig().tracker.stats.queueName);
  }
  async onMessage(message: any): Promise<void> {
    console.log('StatsConsumer', message);
  }
}
