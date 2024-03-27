import { Injectable } from '@nestjs/common';
import { ProducerService } from '@rt/queue-manager';
import { AppConfigService } from '@rt/config';

const SHORTENER_PRODUCER_NAME = 'shortener';

@Injectable()
export class ShortenerProducer extends ProducerService {
  constructor(config: AppConfigService) {
    super(SHORTENER_PRODUCER_NAME, config.getConfig().tracker.stats.queueName);
  }
}
