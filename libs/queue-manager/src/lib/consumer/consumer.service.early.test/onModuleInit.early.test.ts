// Unit tests for: onModuleInit

import { TestConsumerService } from './TestConsumerService'; // Adjust the import path as necessary

class MockAppLoggerService {
  error = jest.fn();
}

class MockQueueManagerService {
  client = {
    consumer: jest.fn().mockReturnValue({
      connect: jest.fn().mockResolvedValue(undefined),
      subscribe: jest.fn().mockResolvedValue(undefined),
      run: jest.fn().mockResolvedValue(undefined),
    }) as any,
  };
}

describe('ConsumerService.onModuleInit() onModuleInit method', () => {
  let service: TestConsumerService;
  let mockLogger: MockAppLoggerService;
  let mockQueueManager: MockQueueManagerService;

  beforeEach(() => {
    mockLogger = new MockAppLoggerService();
    mockQueueManager = new MockQueueManagerService();
    service = new TestConsumerService('test-topic', {
      groupId: 'test-group',
      consumerName: 'test-consumer',
    }) as any;

    // Injecting mocks
    (service as any).logger = mockLogger;
    (service as any).queueManager = mockQueueManager;
  });

  describe('Happy Path', () => {
    it('should connect to the consumer and subscribe to the topic', async () => {
      // Test description: Ensure that the consumer connects and subscribes to the topic correctly.
      await service.onModuleInit();

      expect(mockQueueManager.client.consumer).toHaveBeenCalledWith({ groupId: 'test-group' });
      expect(mockQueueManager.client.consumer().connect).toHaveBeenCalled();
      expect(mockQueueManager.client.consumer().subscribe).toHaveBeenCalledWith({ topic: 'test-topic' });
    });

    it('should run the consumer', async () => {
      // Test description: Ensure that the consumer runs without errors.
      await service.onModuleInit();

      expect(mockQueueManager.client.consumer().run).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should log an error if consumer.run throws an error', async () => {
      // Test description: Ensure that an error during consumer.run is logged.
      const error = new Error('Consumer error');
      mockQueueManager.client.consumer().run.mockRejectedValueOnce(error);

      await service.onModuleInit();

      expect(mockLogger.error).toHaveBeenCalledWith(`Error on consumer test-consumer on topic test-topic`, error);
    });

    it('should handle connection errors gracefully', async () => {
      // Test description: Ensure that an error during consumer.connect is handled gracefully.
      const error = new Error('Connection error');
      mockQueueManager.client.consumer().connect.mockRejectedValueOnce(error);

      await expect(service.onModuleInit()).rejects.toThrow('Connection error');
    });

    it('should handle subscription errors gracefully', async () => {
      // Test description: Ensure that an error during consumer.subscribe is handled gracefully.
      const error = new Error('Subscription error');
      mockQueueManager.client.consumer().subscribe.mockRejectedValueOnce(error);

      await expect(service.onModuleInit()).rejects.toThrow('Subscription error');
    });
  });
});

// End of unit tests for: onModuleInit
