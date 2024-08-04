// Unit tests for: onModuleInit

import { PLAN_LEVELS } from '@reduced.to/subscription-manager';

import { BillingService } from '../billing.service';

class MockPaddle {
  public products = {
    get: jest.fn(),
  };
}

class MockPrismaService {
  public user = {
    findUnique: jest.fn(),
  };
  public subscription = {
    update: jest.fn(),
    delete: jest.fn(),
  };
}

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    paddle: { enable: true, secret: 'mock-secret' },
    general: { env: 'development' },
  });
}

class MockAppLoggerService {
  public error = jest.fn();
}

class MockUsageService {
  public updateLimits = jest.fn();
}

describe('BillingService.onModuleInit() onModuleInit method', () => {
  let service: BillingService;
  let mockPaddle: MockPaddle;
  let mockPrisma: MockPrismaService;
  let mockConfig: MockAppConfigService;
  let mockLogger: MockAppLoggerService;
  let mockUsage: MockUsageService;

  beforeEach(() => {
    mockPaddle = new MockPaddle();
    mockPrisma = new MockPrismaService();
    mockConfig = new MockAppConfigService();
    mockLogger = new MockAppLoggerService();
    mockUsage = new MockUsageService();

    service = new BillingService(mockPrisma as any, mockConfig as any, mockLogger as any, mockUsage as any);
    service['paddleClient'] = mockPaddle as any; // Directly assign mock paddle client
  });

  describe('Happy Path', () => {
    it('should not throw an error when paddle is enabled and all plans are valid', async () => {
      // Arrange
      const planIds = Object.keys(PLAN_LEVELS).map((plan) => PLAN_LEVELS[plan].PADDLE_PLAN_ID);
      mockPaddle.products.get.mockImplementation(async (id: string) => {
        if (!planIds.includes(id)) {
          throw new Error('Invalid plan ID');
        }
      });

      // Act & Assert
      await expect(service.onModuleInit()).resolves.not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should throw an error when paddle is enabled but an invalid plan ID is encountered', async () => {
      // Arrange
      mockPaddle.products.get.mockRejectedValue(new Error('Invalid paddle configuration.'));

      // Act & Assert
      await expect(service.onModuleInit()).rejects.toThrow('Invalid paddle configuration.');
    });

    it('should not throw an error when paddle is disabled', async () => {
      // Arrange
      mockConfig.getConfig.mockReturnValueOnce({
        paddle: { enable: false, secret: 'mock-secret' },
        general: { env: 'development' },
      });

      // Act & Assert
      await expect(service.onModuleInit()).resolves.not.toThrow();
    });
  });
});

// End of unit tests for: onModuleInit
