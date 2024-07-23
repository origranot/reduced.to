// Unit tests for: onSubscriptionModified

import { Plan } from '@reduced.to/prisma';

import { SubscriptionUpdatedEvent } from '@paddle/paddle-node-sdk';

import { BillingService } from '../billing.service';

class MockSubscriptionUpdatedEvent {
  public data: any = {
    id: 'sub_123',
    status: 'active',
    items: [{ price: { productId: 'plan_1' } }],
    nextBilledAt: new Date(),
    startedAt: new Date(),
  };
}

describe('BillingService.onSubscriptionModified() onSubscriptionModified method', () => {
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
  });

  describe('Happy Path', () => {
    it('should update subscription when status is active', async () => {
      // Arrange
      const event = new MockSubscriptionUpdatedEvent() as SubscriptionUpdatedEvent;
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user_123',
        subscription: { id: 'sub_123', plan: Plan.PREMIUM },
      } as any);

      // Act
      await service.onSubscriptionModified(event);

      // Assert
      expect(mockPrisma.subscription.update).toHaveBeenCalledWith({
        where: { id: event.data.id },
        data: {
          status: event.data.status,
          plan: Plan.PREMIUM,
          nextBilledAt: expect.any(Date),
          startDate: expect.any(Date),
        },
      });
      expect(mockUsage.updateLimits).toHaveBeenCalledWith('user_123', Plan.PREMIUM);
    });

    it('should delete subscription when status is canceled', async () => {
      // Arrange
      const event = new MockSubscriptionUpdatedEvent() as SubscriptionUpdatedEvent;
      event.data.status = 'canceled';
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user_123',
        subscription: { id: 'sub_123', plan: Plan.PREMIUM },
      } as any);

      // Act
      await service.onSubscriptionModified(event);

      // Assert
      expect(mockPrisma.subscription.delete).toHaveBeenCalledWith({
        where: { id: event.data.id },
      });
      expect(mockUsage.updateLimits).toHaveBeenCalledWith('user_123', Plan.FREE);
    });
  });

  describe('Edge Cases', () => {
    it('should handle case when user is not found', async () => {
      // Arrange
      const event = new MockSubscriptionUpdatedEvent() as SubscriptionUpdatedEvent;
      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Act
      await service.onSubscriptionModified(event);

      // Assert
      expect(mockPrisma.subscription.update).not.toHaveBeenCalled();
      expect(mockPrisma.subscription.delete).not.toHaveBeenCalled();
      expect(mockUsage.updateLimits).not.toHaveBeenCalled();
    });

    it('should handle case when subscription is not found', async () => {
      // Arrange
      const event = new MockSubscriptionUpdatedEvent() as SubscriptionUpdatedEvent;
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user_123',
        subscription: null,
      } as any);

      // Act
      await service.onSubscriptionModified(event);

      // Assert
      expect(mockPrisma.subscription.update).not.toHaveBeenCalled();
      expect(mockPrisma.subscription.delete).not.toHaveBeenCalled();
      expect(mockUsage.updateLimits).not.toHaveBeenCalled();
    });

    it('should handle case when plan is invalid', async () => {
      // Arrange
      const event = new MockSubscriptionUpdatedEvent() as SubscriptionUpdatedEvent;
      event.data.items[0].price.productId = 'invalid_plan';
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user_123',
        subscription: { id: 'sub_123', plan: Plan.PREMIUM },
      } as any);

      // Act
      await service.onSubscriptionModified(event);

      // Assert
      expect(mockPrisma.subscription.update).toHaveBeenCalledWith({
        where: { id: event.data.id },
        data: {
          status: event.data.status,
          plan: undefined, // Plan should be undefined for invalid plan
          nextBilledAt: expect.any(Date),
          startDate: expect.any(Date),
        },
      });
      expect(mockUsage.updateLimits).toHaveBeenCalledWith('user_123', undefined);
    });
  });
});

// End of unit tests for: onSubscriptionModified
