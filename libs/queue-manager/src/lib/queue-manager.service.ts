import { Inject, Injectable } from '@nestjs/common';
import { QUEUE_MANAGER_INJECTION_TOKEN } from '@reduced.to/queue-manager';
import { Memphis } from 'memphis-dev/*';

@Injectable()
export abstract class QueueManagerService {
  constructor(@Inject(QUEUE_MANAGER_INJECTION_TOKEN) private readonly queueManager: Memphis) {}

  protected getQueueManager() {
    return this.queueManager;
  }
}
