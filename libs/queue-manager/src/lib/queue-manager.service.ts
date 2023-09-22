import { Inject, Injectable } from '@nestjs/common';
import { QUEUE_MANAGER_INJECTION_TOKEN } from './queue-manager.module';
import { Memphis } from 'memphis-dev';

@Injectable()
export class QueueManagerService {
  constructor(@Inject(QUEUE_MANAGER_INJECTION_TOKEN) private readonly queueManager: Memphis) {}

  get client() {
    return this.queueManager;
  }
}
