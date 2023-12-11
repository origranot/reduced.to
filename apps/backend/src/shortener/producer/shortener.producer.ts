import { Injectable } from '@nestjs/common';
import { ProducerService } from '@reduced.to/queue-manager';
import { AppConfigService } from '@reduced.to/config';

const SHORTENER_PRODUCER_NAME = 'shortener';

@Injectable()
export class ShortenerProducer extends ProducerService {
  constructor(config: AppConfigService) {
    super(SHORTENER_PRODUCER_NAME, config.getConfig().tracker.stats.queueName);
  }
}
