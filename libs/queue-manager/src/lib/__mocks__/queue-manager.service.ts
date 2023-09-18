import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueManagerService {
  constructor(private readonly queueManager: any) {}

  produce(payload: any) {
    // Mock implementation for producing messages
    console.log(`Producing message to ${payload.stationName}`);
  }

  getQueueManager() {
    // Mock implementation for getting the queue manager
    return this.queueManager;
  }
}
