// Unit tests for: incrementClicksCount

import { UsageService } from '../usage.service';

class MockPrismaService {
  public usage = {
    update: jest.fn(),
  };
}

describe('UsageService.incrementClicksCount() incrementClicksCount method', () => {
  let usageService: UsageService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    usageService = new UsageService(mockPrismaService as any);
  });

  describe('Happy Path', () => {
    it('should increment clicks count successfully', async () => {
      // Arrange
      const userId = 'user123';
      mockPrismaService.usage.update.mockResolvedValue({ clicksCount: 1 } as any);

      // Act
      const result = await usageService.incrementClicksCount(userId);

      // Assert
      expect(mockPrismaService.usage.update).toHaveBeenCalledWith({
        where: { userId },
        data: { clicksCount: { increment: 1 } },
      });
      expect(result).toEqual({ clicksCount: 1 });
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors when incrementing clicks count', async () => {
      // Arrange
      const userId = 'user123';
      mockPrismaService.usage.update.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(usageService.incrementClicksCount(userId)).rejects.toThrow('Database error');
      expect(mockPrismaService.usage.update).toHaveBeenCalledWith({
        where: { userId },
        data: { clicksCount: { increment: 1 } },
      });
    });

    it('should handle case when userId is undefined', async () => {
      // Arrange
      const userId = undefined;
      mockPrismaService.usage.update.mockResolvedValue({ clicksCount: 1 } as any);

      // Act
      const result = await usageService.incrementClicksCount(userId as any);

      // Assert
      expect(mockPrismaService.usage.update).toHaveBeenCalledWith({
        where: { userId: undefined },
        data: { clicksCount: { increment: 1 } },
      });
      expect(result).toEqual({ clicksCount: 1 });
    });

    it('should handle case when userId is null', async () => {
      // Arrange
      const userId = null;
      mockPrismaService.usage.update.mockResolvedValue({ clicksCount: 1 } as any);

      // Act
      const result = await usageService.incrementClicksCount(userId as any);

      // Assert
      expect(mockPrismaService.usage.update).toHaveBeenCalledWith({
        where: { userId: null },
        data: { clicksCount: { increment: 1 } },
      });
      expect(result).toEqual({ clicksCount: 1 });
    });
  });
});

// End of unit tests for: incrementClicksCount
