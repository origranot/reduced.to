export class MemphisMock {
  produce(payload: { stationName: string; producerName: string; message: any }) {
    console.log(`Producing message to ${payload.stationName}`);
  }
}

// Mock implementation for the queue manager service
export class QueueManagerService {
  private readonly queueManager: MemphisMock;

  constructor() {
    this.queueManager = new MemphisMock();
  }

  get client() {
    // Mock implementation for getting the queue manager
    return this.queueManager;
  }
}
