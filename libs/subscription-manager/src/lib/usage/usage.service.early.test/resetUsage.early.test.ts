// Unit tests for: resetUsage

import { UsageService } from '../usage.service';

class MockPrismaService {
  public usage = {
    updateMany: jest.fn(),
  };

  public user = {
    findMany: jest.fn(),
  };
}

describe('UsageService.resetUsage() resetUsage method', () => {
  let usageService: UsageService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    usageService = new UsageService(mockPrismaService as any);
  });

  describe('Happy Path', () => {
    it('should reset usage for multiple user IDs', async () => {
      // Arrange
      const userIds = ['user1', 'user2'];
      mockPrismaService.usage.updateMany.mockResolvedValue({ count: 2 } as any);

      // Act
      const result = await usageService.resetUsage(userIds);

      // Assert
      expect(mockPrismaService.usage.updateMany).toHaveBeenCalledWith({
        where: {
          userId: { in: userIds },
        },
        data: {
          clicksCount: 0,
          linksCount: 0,
        },
      });
      expect(result).toEqual({ count: 2 });
    });

    it('should reset usage for a single user ID', async () => {
      // Arrange
      const userIds = ['user1'];
      mockPrismaService.usage.updateMany.mockResolvedValue({ count: 1 } as any);

      // Act
      const result = await usageService.resetUsage(userIds);

      // Assert
      expect(mockPrismaService.usage.updateMany).toHaveBeenCalledWith({
        where: {
          userId: { in: userIds },
        },
        data: {
          clicksCount: 0,
          linksCount: 0,
        },
      });
      expect(result).toEqual({ count: 1 });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty user IDs array', async () => {
      // Arrange
      const userIds: string[] = [];
      mockPrismaService.usage.updateMany.mockResolvedValue({ count: 0 } as any);

      // Act
      const result = await usageService.resetUsage(userIds);

      // Assert
      expect(mockPrismaService.usage.updateMany).toHaveBeenCalledWith({
        where: {
          userId: { in: userIds },
        },
        data: {
          clicksCount: 0,
          linksCount: 0,
        },
      });
      expect(result).toEqual({ count: 0 });
    });

    it('should handle error from updateMany', async () => {
      // Arrange
      const userIds = ['user1', 'user2'];
      mockPrismaService.usage.updateMany.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(usageService.resetUsage(userIds)).rejects.toThrow('Database error');
      expect(mockPrismaService.usage.updateMany).toHaveBeenCalledWith({
        where: {
          userId: { in: userIds },
        },
        data: {
          clicksCount: 0,
          linksCount: 0,
        },
      });
    });
  });
});

// End of unit tests for: resetUsage
