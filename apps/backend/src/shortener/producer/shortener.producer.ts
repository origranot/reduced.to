import { Injectable } from '@nestjs/common';
import { ProducerService } from '@reduced.to/queue-manager';

const SHORTENER_PRODUCER_NAME = 'shortener';
const SHORTENER_QUEUE_NAME = 'stats';

@Injectable()
export class ShortenerProducer extends ProducerService {
  constructor() {
    super(SHORTENER_PRODUCER_NAME, SHORTENER_QUEUE_NAME);
  }
}
