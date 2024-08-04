// Unit tests for: decreaseLinksCount

import { UsageService } from '../usage.service';

class MockPrismaService {
  public usage = {
    update: jest.fn(),
  };
}

describe('UsageService.decreaseLinksCount() decreaseLinksCount method', () => {
  let usageService: UsageService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    usageService = new UsageService(mockPrismaService as any);
  });

  describe('Happy Path', () => {
    it('should successfully decrease links count for a valid user', async () => {
      // Arrange
      const userId = 'user123';
      mockPrismaService.usage.update.mockResolvedValue({ linksCount: 5 } as any);

      // Act
      const result = await usageService.decreaseLinksCount(userId);

      // Assert
      expect(mockPrismaService.usage.update).toHaveBeenCalledWith({
        where: { userId },
        data: { linksCount: { decrement: 1 } },
      });
      expect(result).toEqual({ linksCount: 5 });
    });
  });

  describe('Edge Cases', () => {
    it('should handle case when user does not exist', async () => {
      // Arrange
      const userId = 'nonExistentUser';
      mockPrismaService.usage.update.mockResolvedValue(null as any);

      // Act
      const result = await usageService.decreaseLinksCount(userId);

      // Assert
      expect(mockPrismaService.usage.update).toHaveBeenCalledWith({
        where: { userId },
        data: { linksCount: { decrement: 1 } },
      });
      expect(result).toBeNull();
    });

    it('should handle errors thrown by the Prisma service', async () => {
      // Arrange
      const userId = 'user123';
      const errorMessage = 'Database error';
      mockPrismaService.usage.update.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(usageService.decreaseLinksCount(userId)).rejects.toThrow(errorMessage);
      expect(mockPrismaService.usage.update).toHaveBeenCalledWith({
        where: { userId },
        data: { linksCount: { decrement: 1 } },
      });
    });
  });
});

// End of unit tests for: decreaseLinksCount
