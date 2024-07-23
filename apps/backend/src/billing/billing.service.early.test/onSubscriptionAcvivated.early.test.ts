// Unit tests for: onSubscriptionAcvivated

import { BillingService } from '../billing.service';

class MockSubscriptionActivatedEvent {
  public data: any = {
    id: 'sub_123',
    items: [{ price: { productId: 'plan_1' } }],
    nextBilledAt: new Date(),
    status: 'active',
    occurredAt: new Date(),
  };
}

class MockPaddle {
  public subscriptions = {
    upsert: jest.fn(),
  };
}

class MockPrismaService {
  public user = {
    findUnique: jest.fn(),
  };
  public subscription = {
    upsert: jest.fn(),
  };
}

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    paddle: { enable: true, secret: 'secret' },
    general: { env: 'development' },
  });
}

class MockAppLoggerService {
  public error = jest.fn();
}

class MockUsageService {
  public updateLimits = jest.fn();
}

describe('BillingService.onSubscriptionAcvivated() onSubscriptionAcvivated method', () => {
  let service: BillingService;
  let mockPrisma: MockPrismaService;
  let mockPaddle: MockPaddle;
  let mockConfig: MockAppConfigService;
  let mockLogger: MockAppLoggerService;
  let mockUsage: MockUsageService;

  beforeEach(() => {
    mockPrisma = new MockPrismaService();
    mockPaddle = new MockPaddle();
    mockConfig = new MockAppConfigService();
    mockLogger = new MockAppLoggerService();
    mockUsage = new MockUsageService();

    service = new BillingService(mockPrisma as any, mockConfig as any, mockLogger as any, mockUsage as any);
  });

  it('should successfully activate a subscription and update limits', async () => {
    // Arrange
    const mockEvent = new MockSubscriptionActivatedEvent();
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user_123',
      subscription: null,
    } as any);

    // Act
    await service.onSubscriptionAcvivated(mockEvent as any);

    // Assert
    expect(mockPrisma.subscription.upsert).toHaveBeenCalledWith({
      where: { id: mockEvent.data.id },
      update: expect.any(Object),
      create: expect.any(Object),
    });
    expect(mockUsage.updateLimits).toHaveBeenCalledWith('user_123', expect.any(String));
  });

  it('should log an error if the plan is not found', async () => {
    // Arrange
    const mockEvent = new MockSubscriptionActivatedEvent();
    mockEvent.data.items[0].price.productId = 'invalid_plan_id';
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user_123',
      subscription: null,
    } as any);

    // Act
    await service.onSubscriptionAcvivated(mockEvent as any);

    // Assert
    expect(mockLogger.error).toHaveBeenCalledWith('Plan not found with id ', 'invalid_plan_id', 'subscription =>', mockEvent.data.id);
  });

  it('should not proceed if user is not found', async () => {
    // Arrange
    const mockEvent = new MockSubscriptionActivatedEvent();
    mockPrisma.user.findUnique.mockResolvedValue(null);

    // Act
    await service.onSubscriptionAcvivated(mockEvent as any);

    // Assert
    expect(mockPrisma.subscription.upsert).not.toHaveBeenCalled();
    expect(mockUsage.updateLimits).not.toHaveBeenCalled();
  });

  it('should handle errors during subscription upsert', async () => {
    // Arrange
    const mockEvent = new MockSubscriptionActivatedEvent();
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user_123',
      subscription: null,
    } as any);
    mockPrisma.subscription.upsert.mockRejectedValue(new Error('Database error'));

    // Act
    await service.onSubscriptionAcvivated(mockEvent as any);

    // Assert
    expect(mockLogger.error).toHaveBeenCalledWith('Failed to create subscription ', expect.any(Error));
  });
});

// End of unit tests for: onSubscriptionAcvivated
