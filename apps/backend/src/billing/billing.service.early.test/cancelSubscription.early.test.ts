// Unit tests for: cancelSubscription

import { BillingService } from '../billing.service';

class MockPaddle {
  public subscriptions = {
    cancel: jest.fn(),
  };
}

class MockPrismaService {
  public user = {
    findUnique: jest.fn(),
  };
  public subscription = {
    update: jest.fn(),
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

describe('BillingService.cancelSubscription() cancelSubscription method', () => {
  let billingService: BillingService;
  let mockPrisma: MockPrismaService;
  let mockPaddle: MockPaddle;
  let mockAppConfig: MockAppConfigService;
  let mockLogger: MockAppLoggerService;
  let mockUsageService: MockUsageService;

  beforeEach(() => {
    mockPrisma = new MockPrismaService();
    mockPaddle = new MockPaddle();
    mockAppConfig = new MockAppConfigService();
    mockLogger = new MockAppLoggerService();
    mockUsageService = new MockUsageService();

    billingService = new BillingService(mockPrisma as any, mockAppConfig as any, mockLogger as any, mockUsageService as any);
  });

  describe('Happy Path', () => {
    it('should cancel subscription successfully', async () => {
      // Arrange
      const userId = 'user-id';
      const mockUser = {
        id: userId,
        subscription: { id: 'subscription-id' },
      };
      const mockResult = { currentBillingPeriod: { endsAt: new Date() } };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);
      mockPaddle.subscriptions.cancel.mockResolvedValue(mockResult as any);

      // Act
      await billingService.cancelSubscription(userId);

      // Assert
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: { subscription: true },
      });
      expect(mockPaddle.subscriptions.cancel).toHaveBeenCalledWith('subscription-id', {
        effectiveFrom: 'next_billing_period',
      });
      expect(mockPrisma.subscription.update).toHaveBeenCalledWith({
        where: { id: 'subscription-id' },
        data: {
          endDate: mockResult.currentBillingPeriod.endsAt,
          scheduledToBeCancelled: true,
        },
      });
    });
  });

  describe('Edge Cases', () => {
    it('should throw an error if user is not found', async () => {
      // Arrange
      const userId = 'non-existent-user-id';
      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(billingService.cancelSubscription(userId)).rejects.toThrow('User not found');
    });

    it('should throw an error if no subscription is found', async () => {
      // Arrange
      const userId = 'user-id';
      const mockUser = { id: userId, subscription: null };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);

      // Act & Assert
      await expect(billingService.cancelSubscription(userId)).rejects.toThrow('No subscription found');
    });

    it('should throw an error if canceling subscription fails', async () => {
      // Arrange
      const userId = 'user-id';
      const mockUser = {
        id: userId,
        subscription: { id: 'subscription-id' },
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);
      mockPaddle.subscriptions.cancel.mockRejectedValue(new Error('Paddle error'));

      // Act & Assert
      await expect(billingService.cancelSubscription(userId)).rejects.toThrow('Failed to cancel subscription');
    });

    it('should throw an error if updating subscription fails', async () => {
      // Arrange
      const userId = 'user-id';
      const mockUser = {
        id: userId,
        subscription: { id: 'subscription-id' },
      };
      const mockResult = { currentBillingPeriod: { endsAt: new Date() } };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);
      mockPaddle.subscriptions.cancel.mockResolvedValue(mockResult as any);
      mockPrisma.subscription.update.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(billingService.cancelSubscription(userId)).rejects.toThrow('Failed to cancel subscription');
    });
  });
});

// End of unit tests for: cancelSubscription
