// Unit tests for: onSubscriptionCancelled

import { BillingService } from '../billing.service';

class MockSubscriptionCanceledEvent {
  public data = {
    id: 'mock-subscription-id',
    // Add other necessary properties as needed
  };
}

class MockPrismaService {
  public subscription = {
    delete: jest.fn(),
  };
  public user = {
    findUnique: jest.fn(),
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

describe('BillingService.onSubscriptionCancelled() onSubscriptionCancelled method', () => {
  let billingService: BillingService;
  let mockPrismaService: MockPrismaService;
  let mockAppConfigService: MockAppConfigService;
  let mockAppLoggerService: MockAppLoggerService;
  let mockUsageService: MockUsageService;

  beforeEach(() => {
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

  it('should successfully delete the subscription and update usage limits when user exists', async () => {
    // Arrange
    const mockEvent = new MockSubscriptionCanceledEvent();
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'mock-user-id',
      subscription: { id: mockEvent.data.id },
    } as any);

    // Act
    await billingService.onSubscriptionCancelled(mockEvent as any);

    // Assert
    expect(mockPrismaService.subscription.delete).toHaveBeenCalledWith({
      where: { id: mockEvent.data.id },
    });
    expect(mockUsageService.updateLimits).toHaveBeenCalledWith('mock-user-id', expect.anything());
  });

  it('should not throw an error if user does not exist', async () => {
    // Arrange
    const mockEvent = new MockSubscriptionCanceledEvent();
    mockPrismaService.user.findUnique.mockResolvedValue(null);

    // Act
    await billingService.onSubscriptionCancelled(mockEvent as any);

    // Assert
    expect(mockPrismaService.subscription.delete).not.toHaveBeenCalled();
    expect(mockUsageService.updateLimits).not.toHaveBeenCalled();
  });

  it('should not throw an error if user has no subscription', async () => {
    // Arrange
    const mockEvent = new MockSubscriptionCanceledEvent();
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'mock-user-id',
      subscription: null,
    } as any);

    // Act
    await billingService.onSubscriptionCancelled(mockEvent as any);

    // Assert
    expect(mockPrismaService.subscription.delete).not.toHaveBeenCalled();
    expect(mockUsageService.updateLimits).toHaveBeenCalledWith('mock-user-id', expect.anything());
  });

  it('should handle errors when deleting subscription', async () => {
    // Arrange
    const mockEvent = new MockSubscriptionCanceledEvent();
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'mock-user-id',
      subscription: { id: mockEvent.data.id },
    } as any);
    mockPrismaService.subscription.delete.mockRejectedValue(new Error('Delete failed'));

    // Act & Assert
    await expect(billingService.onSubscriptionCancelled(mockEvent as any)).resolves.not.toThrow();
    expect(mockUsageService.updateLimits).toHaveBeenCalledWith('mock-user-id', expect.anything());
  });
});

// End of unit tests for: onSubscriptionCancelled
