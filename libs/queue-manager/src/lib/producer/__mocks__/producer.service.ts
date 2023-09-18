import { QueueManagerService } from '@reduced.to/queue-manager';
import { Memphis } from 'memphis-dev/*';


export abstract class ProducerService extends QueueManagerService {
  constructor(private readonly queueManager: Memphis, protected readonly name: string) {
    super(new MockQueueManager()); // Inject the mock queue manager
  }

  async publish(queueName: string, data: any) {
    return this.getQueueManager().produce({
      stationName: queueName,
      producerName: this.name,
      message: data,
    });
  }
}
