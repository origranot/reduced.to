// Unit tests for: incrementLinksCount

import { UsageService } from '../usage.service';

class MockPrismaService {
  public usage = {
    update: jest.fn(),
  };
}

describe('UsageService.incrementLinksCount() incrementLinksCount method', () => {
  let usageService: UsageService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    usageService = new UsageService(mockPrismaService as any);
  });

  describe('Happy Path', () => {
    it('should increment links count successfully', async () => {
      // Arrange
      const userId = 'test-user-id';
      mockPrismaService.usage.update.mockResolvedValue({ linksCount: 1 } as any);

      // Act
      const result = await usageService.incrementLinksCount(userId);

      // Assert
      expect(mockPrismaService.usage.update).toHaveBeenCalledWith({
        where: { userId },
        data: { linksCount: { increment: 1 } },
      });
      expect(result).toEqual({ linksCount: 1 });
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors when incrementing links count', async () => {
      // Arrange
      const userId = 'test-user-id';
      mockPrismaService.usage.update.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(usageService.incrementLinksCount(userId)).rejects.toThrow('Database error');
      expect(mockPrismaService.usage.update).toHaveBeenCalledWith({
        where: { userId },
        data: { linksCount: { increment: 1 } },
      });
    });

    it('should handle non-existent user gracefully', async () => {
      // Arrange
      const userId = 'non-existent-user-id';
      mockPrismaService.usage.update.mockResolvedValue(null as any);

      // Act
      const result = await usageService.incrementLinksCount(userId);

      // Assert
      expect(mockPrismaService.usage.update).toHaveBeenCalledWith({
        where: { userId },
        data: { linksCount: { increment: 1 } },
      });
      expect(result).toBeNull();
    });
  });
});

// End of unit tests for: incrementLinksCount
