import { Inject } from '@nestjs/common';
import { QUEUE_MANAGER_INJECTION_TOKEN, QueueManagerService } from '@reduced.to/queue-manager';
import { Memphis } from 'memphis-dev/*';

export abstract class ProducerService extends QueueManagerService {
  constructor(@Inject(QUEUE_MANAGER_INJECTION_TOKEN) queueManager: Memphis, protected readonly name: string) {
    super(queueManager);
  }

  async publish(queueName: string, data: any) {
    return this.getQueueManager().produce({
      stationName: queueName,
      producerName: this.name,
      message: data,
    });
  }
}
