// Unit tests for: init

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
    }),
  };
}

class ConcreteProducerService extends ProducerService {
  constructor(producerName: string, topic: string) {
    super(producerName, topic);
  }
}

describe('ProducerService.init() init method', () => {
  let service: ConcreteProducerService;
  let mockLogger: MockAppLoggerService;
  let mockConfig: MockAppConfigService;
  let mockQueueManager: MockQueueManagerService;

  beforeEach(() => {
    mockLogger = new MockAppLoggerService();
    mockConfig = new MockAppConfigService();
    mockQueueManager = new MockQueueManagerService();

    service = new ConcreteProducerService('testProducer', 'testTopic') as any;
    service['logger'] = mockLogger as any;
    service['config'] = mockConfig as any;
    service['queueManager'] = mockQueueManager as any;
  });

  // Happy Path
  it('should initialize the producer and connect successfully', async () => {
    // This test checks if the producer is initialized and connected correctly.
    const connectSpy = jest.spyOn(service['queueManager'].client.producer(), 'connect').mockResolvedValue(undefined);

    await service.init();

    expect(mockLogger.debug).toHaveBeenCalledWith('Initializing testProducer producer');
    expect(connectSpy).toHaveBeenCalled();
  });

  // Edge Cases
  it('should handle connection errors gracefully', async () => {
    // This test checks if the method handles connection errors properly.

    await expect(service.init()).rejects.toThrow('Connection failed');

    expect(mockLogger.debug).toHaveBeenCalledWith('Initializing testProducer producer');
  });

  it('should not throw an error if logger fails', async () => {
    // This test checks if the method continues execution even if the logger fails.
    mockLogger.debug = jest.fn().mockImplementation(() => {
      throw new Error('Logger failed');
    });
    const connectSpy = jest.spyOn(service['queueManager'].client.producer(), 'connect').mockResolvedValue(undefined);

    await service.init();

    expect(connectSpy).toHaveBeenCalled();
  });

  it('should not connect if Kafka is disabled', async () => {
    // This test checks if the method does not attempt to connect when Kafka is disabled.
    mockConfig.getConfig.mockReturnValueOnce({
      general: { env: 'development' },
      kafka: { enable: false },
    });

    await service.init();

    expect(mockLogger.debug).toHaveBeenCalledWith('Initializing testProducer producer');
    expect(mockQueueManager.client.producer).not.toHaveBeenCalled();
  });

  it('should not connect if in test environment', async () => {
    // This test checks if the method does not attempt to connect when in test environment.
    mockConfig.getConfig.mockReturnValueOnce({
      general: { env: 'test' },
      kafka: { enable: true },
    });

    await service.init();

    expect(mockLogger.debug).toHaveBeenCalledWith('Initializing testProducer producer');
    expect(mockQueueManager.client.producer).not.toHaveBeenCalled();
  });
});

// End of unit tests for: init
