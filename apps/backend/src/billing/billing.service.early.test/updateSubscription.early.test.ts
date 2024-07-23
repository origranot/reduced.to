// Unit tests for: updateSubscription

import { Plan } from '@reduced.to/prisma';

import { PLAN_LEVELS } from '@reduced.to/subscription-manager';

import { BillingService } from '../billing.service';

class MockPaddle {
  public subscriptions = {
    update: jest.fn(),
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

describe('BillingService.updateSubscription() updateSubscription method', () => {
  let billingService: BillingService;
  let mockPaddle: MockPaddle;
  let mockPrismaService: MockPrismaService;
  let mockAppConfigService: MockAppConfigService;
  let mockAppLoggerService: MockAppLoggerService;
  let mockUsageService: MockUsageService;

  beforeEach(() => {
    mockPaddle = new MockPaddle();
    mockPrismaService = new MockPrismaService();
    mockAppConfigService = new MockAppConfigService();
    mockAppLoggerService = new MockAppLoggerService();
    mockUsageService = new MockUsageService();

    billingService = new BillingService(
      mockPrismaService as any,
      mockAppConfigService as any,
      mockAppLoggerService as any,
      mockUsageService as any
    );
  });

  describe('Happy Path', () => {
    it('should update subscription successfully', async () => {
      // Arrange
      const userId = 'user-id';
      const newProductId = 'new-product-id';
      const newPriceId = 'new-price-id';
      const operationType = 'update';

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: userId,
        subscription: {
          id: 'subscription-id',
          plan: Plan.BASIC,
        },
      } as any);

      PLAN_LEVELS[Plan.BASIC] = { PADDLE_PLAN_ID: 'current-product-id' };
      PLAN_LEVELS[Plan.PREMIUM] = { PADDLE_PLAN_ID: newProductId };

      mockPaddle.subscriptions.update.mockResolvedValue({
        id: 'new-subscription-id',
        startedAt: new Date(),
        nextBilledAt: new Date(),
        status: 'active',
      } as any);

      // Act
      const result = await billingService.updateSubscription(userId, newProductId, newPriceId, operationType);

      // Assert
      expect(result).toHaveProperty('subscription.id', 'new-subscription-id');
      expect(mockPrismaService.subscription.update).toHaveBeenCalledWith({
        where: { id: 'subscription-id' },
        data: {
          id: 'new-subscription-id',
          plan: Plan.PREMIUM,
          startDate: expect.any(Date),
          nextBilledAt: expect.any(Date),
          status: 'active',
        },
      });
    });
  });

  describe('Edge Cases', () => {
    it('should throw an error if user is not found', async () => {
      // Arrange
      const userId = 'non-existent-user-id';
      const newProductId = 'new-product-id';
      const newPriceId = 'new-price-id';
      const operationType = 'update';

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(billingService.updateSubscription(userId, newProductId, newPriceId, operationType)).rejects.toThrow('User not found');
    });

    it('should throw an error if no subscription is found', async () => {
      // Arrange
      const userId = 'user-id';
      const newProductId = 'new-product-id';
      const newPriceId = 'new-price-id';
      const operationType = 'update';

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: userId,
        subscription: null,
      } as any);

      // Act & Assert
      await expect(billingService.updateSubscription(userId, newProductId, newPriceId, operationType)).rejects.toThrow(
        'No subscription found'
      );
    });

    it('should throw an error if the current plan is invalid', async () => {
      // Arrange
      const userId = 'user-id';
      const newProductId = 'new-product-id';
      const newPriceId = 'new-price-id';
      const operationType = 'update';

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: userId,
        subscription: {
          id: 'subscription-id',
          plan: 'INVALID_PLAN',
        },
      } as any);

      // Act & Assert
      await expect(billingService.updateSubscription(userId, newProductId, newPriceId, operationType)).rejects.toThrow('Invalid plan');
    });

    it('should throw an error if the same plan is selected', async () => {
      // Arrange
      const userId = 'user-id';
      const newProductId = 'current-product-id';
      const newPriceId = 'new-price-id';
      const operationType = 'update';

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: userId,
        subscription: {
          id: 'subscription-id',
          plan: Plan.BASIC,
        },
      } as any);

      PLAN_LEVELS[Plan.BASIC] = { PADDLE_PLAN_ID: 'current-product-id' };

      // Act & Assert
      await expect(billingService.updateSubscription(userId, newProductId, newPriceId, operationType)).rejects.toThrow(
        'Same plan selected'
      );
    });

    it('should throw an error if the new plan ID is invalid', async () => {
      // Arrange
      const userId = 'user-id';
      const newProductId = 'invalid-product-id';
      const newPriceId = 'new-price-id';
      const operationType = 'update';

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: userId,
        subscription: {
          id: 'subscription-id',
          plan: Plan.BASIC,
        },
      } as any);

      PLAN_LEVELS[Plan.BASIC] = { PADDLE_PLAN_ID: 'current-product-id' };

      // Act & Assert
      await expect(billingService.updateSubscription(userId, newProductId, newPriceId, operationType)).rejects.toThrow('Invalid plan id');
    });
  });
});

// End of unit tests for: updateSubscription
