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

  it('should update subscription status and plan when subscription is active', async () => {
    // Arrange
    const mockEvent = new MockSubscriptionUpdatedEvent();
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'user_123',
      subscription: { id: 'sub_123', plan: Plan.PREMIUM },
    } as any);

    // Act
    await billingService.onSubscriptionModified(mockEvent as SubscriptionUpdatedEvent);

    // Assert
    expect(mockPrismaService.subscription.update).toHaveBeenCalledWith({
      where: { id: mockEvent.data.id },
      data: {
        status: mockEvent.data.status,
        plan: Plan.PREMIUM,
        nextBilledAt: expect.any(Date),
        startDate: expect.any(Date),
      },
    });
    expect(mockUsageService.updateLimits).toHaveBeenCalledWith('user_123', Plan.PREMIUM);
  });

  it('should delete subscription when status is canceled', async () => {
    // Arrange
    const mockEvent = new MockSubscriptionUpdatedEvent();
    mockEvent.data.status = 'canceled';
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'user_123',
      subscription: { id: 'sub_123', plan: Plan.PREMIUM },
    } as any);

    // Act
    await billingService.onSubscriptionModified(mockEvent as SubscriptionUpdatedEvent);

    // Assert
    expect(mockPrismaService.subscription.delete).toHaveBeenCalledWith({
      where: { id: mockEvent.data.id },
    });
    expect(mockUsageService.updateLimits).toHaveBeenCalledWith('user_123', Plan.FREE);
  });

  it('should handle case when user is not found', async () => {
    // Arrange
    const mockEvent = new MockSubscriptionUpdatedEvent();
    mockPrismaService.user.findUnique.mockResolvedValue(null);

    // Act
    await billingService.onSubscriptionModified(mockEvent as SubscriptionUpdatedEvent);

    // Assert
    expect(mockPrismaService.subscription.update).not.toHaveBeenCalled();
    expect(mockPrismaService.subscription.delete).not.toHaveBeenCalled();
  });

  it('should handle case when subscription is not found', async () => {
    // Arrange
    const mockEvent = new MockSubscriptionUpdatedEvent();
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'user_123',
      subscription: null,
    } as any);

    // Act
    await billingService.onSubscriptionModified(mockEvent as SubscriptionUpdatedEvent);

    // Assert
    expect(mockPrismaService.subscription.update).not.toHaveBeenCalled();
    expect(mockPrismaService.subscription.delete).not.toHaveBeenCalled();
  });

  it('should handle case when plan is invalid', async () => {
    // Arrange
    const mockEvent = new MockSubscriptionUpdatedEvent();
    mockEvent.data.items[0].price.productId = 'invalid_plan_id';
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'user_123',
      subscription: { id: 'sub_123', plan: Plan.PREMIUM },
    } as any);

    // Act
    await billingService.onSubscriptionModified(mockEvent as SubscriptionUpdatedEvent);

    // Assert
    expect(mockAppLoggerService.error).toHaveBeenCalledWith(
      'Plan not found with id ',
      'invalid_plan_id',
      'subscription =>',
      mockEvent.data.id
    );
  });
});

// End of unit tests for: onSubscriptionModified
