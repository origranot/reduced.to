// Unit tests for: isEligibleToCreateLink

import { UsageService } from '../usage.service';

class MockPrismaService {
  public usage = {
    findUnique: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  };

  public user = {
    findMany: jest.fn(),
  };
}

describe('UsageService.isEligibleToCreateLink() isEligibleToCreateLink method', () => {
  let service: UsageService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    service = new UsageService(mockPrismaService as any);
  });

  describe('Happy Path', () => {
    it('should return true if linksCount is less than linksLimit', async () => {
      // Arrange
      const userId = 'user123';
      mockPrismaService.usage.findUnique.mockResolvedValue({
        linksCount: 2,
        linksLimit: 5,
      } as any);

      // Act
      const result = await service.isEligibleToCreateLink(userId);

      // Assert
      expect(result).toBe(true);
      expect(mockPrismaService.usage.findUnique).toHaveBeenCalledWith({ where: { userId } });
    });

    it('should return false if linksCount is equal to linksLimit', async () => {
      // Arrange
      const userId = 'user123';
      mockPrismaService.usage.findUnique.mockResolvedValue({
        linksCount: 5,
        linksLimit: 5,
      } as any);

      // Act
      const result = await service.isEligibleToCreateLink(userId);

      // Assert
      expect(result).toBe(false);
      expect(mockPrismaService.usage.findUnique).toHaveBeenCalledWith({ where: { userId } });
    });

    it('should return false if linksCount is greater than linksLimit', async () => {
      // Arrange
      const userId = 'user123';
      mockPrismaService.usage.findUnique.mockResolvedValue({
        linksCount: 6,
        linksLimit: 5,
      } as any);

      // Act
      const result = await service.isEligibleToCreateLink(userId);

      // Assert
      expect(result).toBe(false);
      expect(mockPrismaService.usage.findUnique).toHaveBeenCalledWith({ where: { userId } });
    });
  });

  describe('Edge Cases', () => {
    it('should return false if usage is not found', async () => {
      // Arrange
      const userId = 'user123';
      mockPrismaService.usage.findUnique.mockResolvedValue(null as any);

      // Act
      const result = await service.isEligibleToCreateLink(userId);

      // Assert
      expect(result).toBe(false);
      expect(mockPrismaService.usage.findUnique).toHaveBeenCalledWith({ where: { userId } });
    });

    it('should handle errors from the database gracefully', async () => {
      // Arrange
      const userId = 'user123';
      mockPrismaService.usage.findUnique.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await service.isEligibleToCreateLink(userId);

      // Assert
      expect(result).toBe(false); // Assuming we want to return false on error
      expect(mockPrismaService.usage.findUnique).toHaveBeenCalledWith({ where: { userId } });
    });
  });
});

// End of unit tests for: isEligibleToCreateLink
