import { Injectable, OnModuleInit } from '@nestjs/common';
import { ProducerService } from '@reduced.to/queue-manager';
import { AppConfigService } from '@reduced.to/config';

const SHORTENER_PRODUCER_NAME = 'shortener';

@Injectable()
export class ShortenerProducer extends ProducerService implements OnModuleInit {
  constructor(config: AppConfigService) {
    super(SHORTENER_PRODUCER_NAME, config.getConfig().tracker.stats.topic);
  }

  async onModuleInit() {
    this.init();
  }
}
