// Unit tests for: publish

import { ProducerService } from '../producer.service';

class MockAppLoggerService {
  public debug = jest.fn();
  public error = jest.fn();
}

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    general: { env: 'development' },
    kafka: { enable: true },
  });
}

class MockQueueManagerService {
  public client = {
    producer: jest.fn().mockReturnValue(new MockProducer()),
  };
}

class MockProducer {
  public send = jest.fn();
  public connect = jest.fn().mockResolvedValue(undefined);
  public disconnect = jest.fn().mockResolvedValue(undefined);
}

class ConcreteProducerService extends ProducerService {
  constructor() {
    super('testProducer', 'testTopic');
  }
}

describe('ProducerService.publish() publish method', () => {
  let service: ConcreteProducerService;
  let mockLogger: MockAppLoggerService;
  let mockConfig: MockAppConfigService;
  let mockQueueManager: MockQueueManagerService;
  let mockProducer: MockProducer;

  beforeEach(() => {
    mockLogger = new MockAppLoggerService();
    mockConfig = new MockAppConfigService();
    mockQueueManager = new MockQueueManagerService();
    mockProducer = new MockProducer();

    service = new ConcreteProducerService() as any;
    service['logger'] = mockLogger as any;
    service['config'] = mockConfig as any;
    service['queueManager'] = mockQueueManager as any;
    service['producer'] = mockProducer as any;
  });

  describe('Happy Path', () => {
    it('should publish a message when Kafka is enabled and not in test environment', async () => {
      // Arrange
      const message = { key: 'value' };
      mockConfig.getConfig.mockReturnValueOnce({
        general: { env: 'development' },
        kafka: { enable: true },
      });

      // Act
      await service.publish(message);

      // Assert
      expect(mockLogger.debug).toHaveBeenCalledWith('Publishing message to testTopic with producer testProducer');
      expect(mockProducer.send).toHaveBeenCalledWith({
        topic: 'testTopic',
        messages: [{ value: JSON.stringify(message) }],
      });
    });
  });

  describe('Edge Cases', () => {
    it('should not publish if Kafka is disabled', async () => {
      // Arrange
      const message = { key: 'value' };
      mockConfig.getConfig.mockReturnValueOnce({
        general: { env: 'development' },
        kafka: { enable: false },
      });

      // Act
      await service.publish(message);

      // Assert
      expect(mockProducer.send).not.toHaveBeenCalled();
    });

    it('should not publish if in test environment', async () => {
      // Arrange
      const message = { key: 'value' };
      mockConfig.getConfig.mockReturnValueOnce({
        general: { env: 'test' },
        kafka: { enable: true },
      });

      // Act
      await service.publish(message);

      // Assert
      expect(mockProducer.send).not.toHaveBeenCalled();
    });

    it('should handle errors thrown by producer.send', async () => {
      // Arrange
      const message = { key: 'value' };
      mockProducer.send.mockRejectedValueOnce(new Error('Kafka error'));
      mockConfig.getConfig.mockReturnValueOnce({
        general: { env: 'development' },
        kafka: { enable: true },
      });

      // Act
      await service.publish(message);

      // Assert
      expect(mockLogger.error).toHaveBeenCalledWith('Error while publishing shortened url: Kafka error');
    });
  });
});

// End of unit tests for: publish
