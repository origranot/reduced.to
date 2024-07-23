// Unit tests for: updateLimits

import { PLAN_LEVELS } from '../../limits';

import { UsageService } from '../usage.service';

class MockPrismaService {
  public usage = {
    update: jest.fn(),
  };

  constructor() {
    // Initialize any other necessary properties or methods here
  }
}

describe('UsageService.updateLimits() updateLimits method', () => {
  let usageService: UsageService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService() as any;
    usageService = new UsageService(mockPrismaService as any);
  });

  describe('updateLimits', () => {
    it('should update limits correctly for a valid plan', async () => {
      // Arrange
      const userId = 'user123';
      const plan = 'PREMIUM';
      const expectedClicksLimit = PLAN_LEVELS.PREMIUM.FEATURES.TRACKED_CLICKS.value;
      const expectedLinksLimit = PLAN_LEVELS.PREMIUM.FEATURES.LINKS_COUNT.value;

      mockPrismaService.usage.update.mockResolvedValue({} as any);

      // Act
      await usageService.updateLimits(userId, plan);

      // Assert
      expect(mockPrismaService.usage.update).toHaveBeenCalledWith({
        where: { userId },
        data: {
          clicksLimit: expectedClicksLimit,
          linksLimit: expectedLinksLimit,
        },
      });
    });

    it('should default to FREE plan if an invalid plan is provided', async () => {
      // Arrange
      const userId = 'user123';
      const invalidPlan = 'INVALID_PLAN';
      const expectedClicksLimit = PLAN_LEVELS.FREE.FEATURES.TRACKED_CLICKS.value;
      const expectedLinksLimit = PLAN_LEVELS.FREE.FEATURES.LINKS_COUNT.value;

      mockPrismaService.usage.update.mockResolvedValue({} as any);

      // Act
      await usageService.updateLimits(userId, invalidPlan);

      // Assert
      expect(mockPrismaService.usage.update).toHaveBeenCalledWith({
        where: { userId },
        data: {
          clicksLimit: expectedClicksLimit,
          linksLimit: expectedLinksLimit,
        },
      });
    });

    it('should handle errors thrown by the PrismaService', async () => {
      // Arrange
      const userId = 'user123';
      const plan = 'PREMIUM';

      mockPrismaService.usage.update.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(usageService.updateLimits(userId, plan)).rejects.toThrow('Database error');
    });

    it('should update limits correctly for the FREE plan', async () => {
      // Arrange
      const userId = 'user123';
      const plan = 'FREE';
      const expectedClicksLimit = PLAN_LEVELS.FREE.FEATURES.TRACKED_CLICKS.value;
      const expectedLinksLimit = PLAN_LEVELS.FREE.FEATURES.LINKS_COUNT.value;

      mockPrismaService.usage.update.mockResolvedValue({} as any);

      // Act
      await usageService.updateLimits(userId, plan);

      // Assert
      expect(mockPrismaService.usage.update).toHaveBeenCalledWith({
        where: { userId },
        data: {
          clicksLimit: expectedClicksLimit,
          linksLimit: expectedLinksLimit,
        },
      });
    });
  });
});

// End of unit tests for: updateLimits
