// Unit tests for: onModuleInit

import { ShortenerProducer } from '../shortener.producer';

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    tracker: {
      stats: {
        topic: 'mock-topic',
      },
    },
  }) as any;
}

describe('ShortenerProducer.onModuleInit() onModuleInit method', () => {
  let shortenerProducer: ShortenerProducer;
  let mockAppConfigService: MockAppConfigService;

  beforeEach(() => {
    mockAppConfigService = new MockAppConfigService();
    shortenerProducer = new ShortenerProducer(mockAppConfigService as any);
  });

  describe('onModuleInit', () => {
    it('should call init method when module is initialized', async () => {
      // Arrange
      const initSpy = jest.spyOn(shortenerProducer, 'init').mockImplementation(() => {});

      // Act
      await shortenerProducer.onModuleInit();

      // Assert
      expect(initSpy).toHaveBeenCalled();
    });

    it('should not call init method if the producer is not enabled', async () => {
      // Arrange
      shortenerProducer['enabled'] = false; // Simulating the disabled state
      const initSpy = jest.spyOn(shortenerProducer, 'init').mockImplementation(() => {});

      // Act
      await shortenerProducer.onModuleInit();

      // Assert
      expect(initSpy).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully when paddleClient fails', async () => {
      // Arrange
      shortenerProducer['enabled'] = true; // Simulating the enabled state
      shortenerProducer['paddleClient'] = {
        products: {
          get: jest.fn().mockRejectedValue(new Error('Paddle error')) as any,
        },
      };

      // Act & Assert
      await expect(shortenerProducer.onModuleInit()).rejects.toThrow('Invalid paddle configuration.');
    });

    it('should successfully validate paddle plans when paddleClient succeeds', async () => {
      // Arrange
      shortenerProducer['enabled'] = true; // Simulating the enabled state
      const paddlePlanIds = ['plan1', 'plan2'];
      shortenerProducer['paddleClient'] = {
        products: {
          get: jest.fn().mockResolvedValue({}) as any,
        },
      };
      jest.spyOn(shortenerProducer, 'getPaddlePlanIds').mockReturnValue(paddlePlanIds as any);

      // Act
      await shortenerProducer.onModuleInit();

      // Assert
      paddlePlanIds.forEach((id) => {
        expect(shortenerProducer['paddleClient'].products.get).toHaveBeenCalledWith(id);
      });
    });
  });
});

// End of unit tests for: onModuleInit
