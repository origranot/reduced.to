// Unit tests for: resumeSubscription

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

describe('BillingService.resumeSubscription() resumeSubscription method', () => {
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

  // Happy Path
  it('should resume subscription successfully', async () => {
    // Arrange
    const userId = 'user-id';
    const mockUser = {
      id: userId,
      subscription: {
        id: 'subscription-id',
        scheduledToBeCancelled: true,
      },
    };

    mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);
    mockPaddle.subscriptions.update.mockResolvedValue({ status: 'active' } as any);
    mockPrisma.subscription.update.mockResolvedValue({} as any);

    // Act
    await billingService.resumeSubscription(userId);

    // Assert
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
      include: { subscription: true },
    });
    expect(mockPaddle.subscriptions.update).toHaveBeenCalledWith('subscription-id', {
      scheduledChange: null,
    });
    expect(mockPrisma.subscription.update).toHaveBeenCalledWith({
      where: { id: 'subscription-id' },
      data: {
        endDate: null,
        scheduledToBeCancelled: false,
        status: 'active',
      },
    });
  });

  // Edge Cases
  it('should throw an error if user is not found', async () => {
    // Arrange
    const userId = 'non-existent-user-id';
    mockPrisma.user.findUnique.mockResolvedValue(null);

    // Act & Assert
    await expect(billingService.resumeSubscription(userId)).rejects.toThrow('User not found');
  });

  it('should throw an error if no subscription is found', async () => {
    // Arrange
    const userId = 'user-id';
    const mockUser = {
      id: userId,
      subscription: null,
    };

    mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);

    // Act & Assert
    await expect(billingService.resumeSubscription(userId)).rejects.toThrow('No subscription found');
  });

  it('should throw an error if subscription is not scheduled to be cancelled', async () => {
    // Arrange
    const userId = 'user-id';
    const mockUser = {
      id: userId,
      subscription: {
        id: 'subscription-id',
        scheduledToBeCancelled: false,
      },
    };

    mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);

    // Act & Assert
    await expect(billingService.resumeSubscription(userId)).rejects.toThrow('Subscription is not scheduled to be cancelled');
  });

  it('should handle errors from Paddle update gracefully', async () => {
    // Arrange
    const userId = 'user-id';
    const mockUser = {
      id: userId,
      subscription: {
        id: 'subscription-id',
        scheduledToBeCancelled: true,
      },
    };

    mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);
    mockPaddle.subscriptions.update.mockRejectedValue(new Error('Paddle error'));

    // Act & Assert
    await expect(billingService.resumeSubscription(userId)).rejects.toThrow('Paddle error');
  });

  it('should handle errors from Prisma update gracefully', async () => {
    // Arrange
    const userId = 'user-id';
    const mockUser = {
      id: userId,
      subscription: {
        id: 'subscription-id',
        scheduledToBeCancelled: true,
      },
    };

    mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);
    mockPaddle.subscriptions.update.mockResolvedValue({ status: 'active' } as any);
    mockPrisma.subscription.update.mockRejectedValue(new Error('Prisma error'));

    // Act & Assert
    await expect(billingService.resumeSubscription(userId)).rejects.toThrow('Prisma error');
  });
});

// End of unit tests for: resumeSubscription
