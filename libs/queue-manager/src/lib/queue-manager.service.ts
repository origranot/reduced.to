import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { QUEUE_MANAGER_INJECTION_TOKEN } from './queue-manager.module';
import { Kafka } from 'kafkajs';

@Injectable()
export class QueueManagerService {
  constructor(@Inject(QUEUE_MANAGER_INJECTION_TOKEN) private readonly queueManager: Kafka) {}

  get client() {
    return this.queueManager;
  }
}
