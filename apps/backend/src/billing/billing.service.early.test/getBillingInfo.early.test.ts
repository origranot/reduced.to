// Unit tests for: getBillingInfo

import { Plan } from '@reduced.to/prisma';

import { PLAN_LEVELS } from '@reduced.to/subscription-manager';

import { BillingService } from '../billing.service';

class MockPaddle {
  public subscriptions = {
    cancel: jest.fn(),
    update: jest.fn(),
  };
  public products = {
    get: jest.fn(),
  };
  public webhooks = {
    unmarshal: jest.fn(),
  };
}

class MockPrismaService {
  public user = {
    findUnique: jest.fn(),
  };
  public subscription = {
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
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

describe('BillingService.getBillingInfo() getBillingInfo method', () => {
  let billingService: BillingService;
  let mockPrisma: MockPrismaService;
  let mockConfig: MockAppConfigService;
  let mockLogger: MockAppLoggerService;
  let mockUsage: MockUsageService;
  let mockPaddle: MockPaddle;

  beforeEach(() => {
    mockPrisma = new MockPrismaService();
    mockConfig = new MockAppConfigService();
    mockLogger = new MockAppLoggerService();
    mockUsage = new MockUsageService();
    mockPaddle = new MockPaddle();

    billingService = new BillingService(mockPrisma as any, mockConfig as any, mockLogger as any, mockUsage as any);
  });

  describe('Happy Path', () => {
    it('should return billing info for a user with an active subscription', async () => {
      // Arrange
      const userId = 'user-123';
      const mockUser = {
        id: userId,
        createdAt: new Date(),
        subscription: {
          id: 'sub-123',
          plan: Plan.PRO,
          startDate: new Date(),
          endDate: new Date(),
          nextBilledAt: new Date(),
          scheduledToBeCancelled: false,
        },
        usage: {
          linksCount: 5,
          clicksCount: 10,
        },
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);

      // Act
      const result = await billingService.getBillingInfo(userId);

      // Assert
      expect(result).toEqual({
        id: 'sub-123',
        plan: Plan.PRO,
        startDate: mockUser.subscription.startDate,
        endDate: mockUser.subscription.endDate,
        scheduledToBeCancelled: false,
        nextBillingAt: mockUser.subscription.nextBilledAt,
        limits: {
          linksCount: PLAN_LEVELS[Plan.PRO].FEATURES.LINKS_COUNT.value,
          trackedClicks: PLAN_LEVELS[Plan.PRO].FEATURES.TRACKED_CLICKS.value,
        },
        usage: {
          currentLinkCount: 5,
          currentTrackedClicks: 10,
        },
      });
    });

    it('should return billing info for a user without an active subscription', async () => {
      // Arrange
      const userId = 'user-456';
      const mockUser = {
        id: userId,
        createdAt: new Date(),
        subscription: null,
        usage: {
          linksCount: 0,
          clicksCount: 0,
        },
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);

      // Act
      const result = await billingService.getBillingInfo(userId);

      // Assert
      expect(result).toEqual({
        id: '',
        plan: Plan.FREE,
        startDate: mockUser.createdAt,
        endDate: null,
        scheduledToBeCancelled: false,
        nextBillingAt: null,
        limits: {
          linksCount: PLAN_LEVELS[Plan.FREE].FEATURES.LINKS_COUNT.value,
          trackedClicks: PLAN_LEVELS[Plan.FREE].FEATURES.TRACKED_CLICKS.value,
        },
        usage: {
          currentLinkCount: 0,
          currentTrackedClicks: 0,
        },
      });
    });
  });

  describe('Edge Cases', () => {
    it('should throw an error if the user is not found', async () => {
      // Arrange
      const userId = 'non-existent-user';
      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(billingService.getBillingInfo(userId)).rejects.toThrow('User not found');
    });

    it('should handle a user with no usage data gracefully', async () => {
      // Arrange
      const userId = 'user-789';
      const mockUser = {
        id: userId,
        createdAt: new Date(),
        subscription: {
          id: 'sub-789',
          plan: Plan.FREE,
          startDate: new Date(),
          endDate: new Date(),
          nextBilledAt: new Date(),
          scheduledToBeCancelled: false,
        },
        usage: null,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);

      // Act
      const result = await billingService.getBillingInfo(userId);

      // Assert
      expect(result).toEqual({
        id: 'sub-789',
        plan: Plan.FREE,
        startDate: mockUser.subscription.startDate,
        endDate: mockUser.subscription.endDate,
        scheduledToBeCancelled: false,
        nextBillingAt: mockUser.subscription.nextBilledAt,
        limits: {
          linksCount: PLAN_LEVELS[Plan.FREE].FEATURES.LINKS_COUNT.value,
          trackedClicks: PLAN_LEVELS[Plan.FREE].FEATURES.TRACKED_CLICKS.value,
        },
        usage: {
          currentLinkCount: 0,
          currentTrackedClicks: 0,
        },
      });
    });
  });
});

// End of unit tests for: getBillingInfo
