// Unit tests for: getTotalVisits

import { AnalyticsService } from '../analytics.service';

class MockAppLoggerService {
  log = jest.fn();
  error = jest.fn();
}

class MockPrismaService {
  visit = {
    count: jest.fn(),
  };
}

describe('AnalyticsService.getTotalVisits() getTotalVisits method', () => {
  let analyticsService: AnalyticsService;
  let mockLogger: MockAppLoggerService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockLogger = new MockAppLoggerService();
    mockPrismaService = new MockPrismaService();
    analyticsService = new AnalyticsService(mockLogger as any, mockPrismaService as any);
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should return the total visits for a valid key and userId', async () => {
      // Arrange
      const key = 'validKey';
      const userId = 'validUserId';
      const expectedCount = 5;
      mockPrismaService.visit.count.mockResolvedValue(expectedCount as any);

      // Act
      const result = await analyticsService.getTotalVisits(key, userId);

      // Assert
      expect(result).toBe(expectedCount);
      expect(mockPrismaService.visit.count).toHaveBeenCalledWith({
        where: {
          link: {
            key,
            userId,
          },
        },
      });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return 0 when there are no visits for the given key and userId', async () => {
      // Arrange
      const key = 'nonExistentKey';
      const userId = 'nonExistentUserId';
      mockPrismaService.visit.count.mockResolvedValue(0 as any);

      // Act
      const result = await analyticsService.getTotalVisits(key, userId);

      // Assert
      expect(result).toBe(0);
      expect(mockPrismaService.visit.count).toHaveBeenCalledWith({
        where: {
          link: {
            key,
            userId,
          },
        },
      });
    });

    it('should handle errors thrown by the Prisma service', async () => {
      // Arrange
      const key = 'errorKey';
      const userId = 'errorUserId';
      const errorMessage = 'Database error';
      mockPrismaService.visit.count.mockRejectedValue(new Error(errorMessage) as never);

      // Act & Assert
      await expect(analyticsService.getTotalVisits(key, userId)).rejects.toThrow(errorMessage);
      expect(mockPrismaService.visit.count).toHaveBeenCalledWith({
        where: {
          link: {
            key,
            userId,
          },
        },
      });
    });

    it('should handle empty strings for key and userId', async () => {
      // Arrange
      const key = '';
      const userId = '';
      const expectedCount = 0;
      mockPrismaService.visit.count.mockResolvedValue(expectedCount as any);

      // Act
      const result = await analyticsService.getTotalVisits(key, userId);

      // Assert
      expect(result).toBe(expectedCount);
      expect(mockPrismaService.visit.count).toHaveBeenCalledWith({
        where: {
          link: {
            key,
            userId,
          },
        },
      });
    });
  });
});

// End of unit tests for: getTotalVisits
