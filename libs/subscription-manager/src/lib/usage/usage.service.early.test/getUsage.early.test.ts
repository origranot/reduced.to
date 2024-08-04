// Unit tests for: getUsage

import { UsageService } from '../usage.service';

class MockPrismaService {
  public usage = {
    findUnique: jest.fn(),
  };
}

describe('UsageService.getUsage() getUsage method', () => {
  let service: UsageService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    service = new UsageService(mockPrismaService as any);
  });

  describe('Happy Path', () => {
    it('should return usage data for a valid userId', async () => {
      // Arrange
      const userId = 'validUserId';
      const mockUsageData = { clicksCount: 10, linksCount: 5, clicksLimit: 100, linksLimit: 10 };
      mockPrismaService.usage.findUnique.mockResolvedValue(mockUsageData as any);

      // Act
      const result = await service.getUsage(userId);

      // Assert
      expect(result).toEqual(mockUsageData);
      expect(mockPrismaService.usage.findUnique).toHaveBeenCalledWith({ where: { userId } });
    });
  });

  describe('Edge Cases', () => {
    it('should return null if no usage data is found for the userId', async () => {
      // Arrange
      const userId = 'nonExistentUserId';
      mockPrismaService.usage.findUnique.mockResolvedValue(null as any);

      // Act
      const result = await service.getUsage(userId);

      // Assert
      expect(result).toBeNull();
      expect(mockPrismaService.usage.findUnique).toHaveBeenCalledWith({ where: { userId } });
    });

    it('should handle errors thrown by the Prisma service', async () => {
      // Arrange
      const userId = 'errorUserId';
      mockPrismaService.usage.findUnique.mockRejectedValue(new Error('Database error') as never);

      // Act & Assert
      await expect(service.getUsage(userId)).rejects.toThrow('Database error');
      expect(mockPrismaService.usage.findUnique).toHaveBeenCalledWith({ where: { userId } });
    });
  });
});

// End of unit tests for: getUsage
