// Mock implementation for the queue manager service (memphis-dev)
export class MemphisMock {
  produce(payload: any) {
    console.log(`Producing message to ${payload.stationName}`);
  }
}

// Mock implementation for the queue manager service
export class QueueManagerService {
  private readonly queueManager: MemphisMock;

  constructor() {
    this.queueManager = new MemphisMock();
  }

  getQueueManager() {
    // Mock implementation for getting the queue manager
    return this.queueManager;
  }
}
