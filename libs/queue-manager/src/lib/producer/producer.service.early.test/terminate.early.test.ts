// Unit tests for: terminate

import { ProducerService } from '../producer.service';

class MockAppLoggerService {
  public debug = jest.fn();
}

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    general: { env: 'development' },
    kafka: { enable: true },
  });
}

class MockQueueManagerService {
  public client = {
    producer: jest.fn().mockReturnValue({
      connect: jest.fn(),
      disconnect: jest.fn(),
    }),
  };
}

type MockProducer = {
  connect: jest.Mock;
  disconnect: jest.Mock;
};

class ConcreteProducerService extends ProducerService {
  constructor(producerName: string, topic: string) {
    super(producerName, topic);
  }
}

describe('ProducerService.terminate() terminate method', () => {
  let service: ConcreteProducerService;
  let mockLogger: MockAppLoggerService;
  let mockConfig: MockAppConfigService;
  let mockQueueManager: MockQueueManagerService;
  let mockProducer: MockProducer;

  beforeEach(() => {
    mockLogger = new MockAppLoggerService();
    mockConfig = new MockAppConfigService();
    mockQueueManager = new MockQueueManagerService();
    mockProducer = mockQueueManager.client.producer() as any;

    service = new ConcreteProducerService('testProducer', 'testTopic');
    (service as any).logger = mockLogger;
    (service as any).config = mockConfig;
    (service as any).queueManager = mockQueueManager;
    (service as any).producer = mockProducer;

    // Initialize the producer before tests
    service.init();
  });

  it('should log debug message when terminating the producer', async () => {
    // This test checks if the debug log is called when terminating
    await service.terminate();
    expect(mockLogger.debug).toHaveBeenCalledWith('Terminating producer testProducer');
  });

  it('should call disconnect on the producer when terminating', async () => {
    // This test checks if the disconnect method is called on the producer
    await service.terminate();
    expect(mockProducer.disconnect).toHaveBeenCalled();
  });

  it('should handle errors during disconnection gracefully', async () => {
    // This test checks if the method handles errors during disconnection
    mockProducer.disconnect.mockRejectedValue(new Error('Disconnect error'));

    await expect(service.terminate()).rejects.toThrow('Disconnect error');
  });

  it('should not throw an error if disconnect is called multiple times', async () => {
    // This test checks if the method can handle multiple calls to terminate
    await service.terminate();
    await service.terminate(); // Call again to see if it handles gracefully
    expect(mockProducer.disconnect).toHaveBeenCalledTimes(1); // Should still only call once
  });
});

// End of unit tests for: terminate
