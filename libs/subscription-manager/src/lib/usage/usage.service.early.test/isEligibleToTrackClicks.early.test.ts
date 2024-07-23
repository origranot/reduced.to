// Unit tests for: isEligibleToTrackClicks

import { UsageService } from '../usage.service';

class MockPrismaService {
  public usage = {
    findUnique: jest.fn(),
  };
}

describe('UsageService.isEligibleToTrackClicks() isEligibleToTrackClicks method', () => {
  let service: UsageService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    service = new UsageService(mockPrismaService as any);
  });

  describe('Happy Path', () => {
    it('should return true when clicksCount is less than clicksLimit', async () => {
      // Arrange
      const userId = 'user123';
      mockPrismaService.usage.findUnique.mockResolvedValue({
        clicksCount: 5,
        clicksLimit: 10,
      } as any);

      // Act
      const result = await service.isEligibleToTrackClicks(userId);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when clicksCount is equal to clicksLimit', async () => {
      // Arrange
      const userId = 'user123';
      mockPrismaService.usage.findUnique.mockResolvedValue({
        clicksCount: 10,
        clicksLimit: 10,
      } as any);

      // Act
      const result = await service.isEligibleToTrackClicks(userId);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when clicksCount is greater than clicksLimit', async () => {
      // Arrange
      const userId = 'user123';
      mockPrismaService.usage.findUnique.mockResolvedValue({
        clicksCount: 15,
        clicksLimit: 10,
      } as any);

      // Act
      const result = await service.isEligibleToTrackClicks(userId);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should return false when usage is not found', async () => {
      // Arrange
      const userId = 'user123';
      mockPrismaService.usage.findUnique.mockResolvedValue(null);

      // Act
      const result = await service.isEligibleToTrackClicks(userId);

      // Assert
      expect(result).toBe(false);
    });

    it('should handle errors from the database gracefully', async () => {
      // Arrange
      const userId = 'user123';
      mockPrismaService.usage.findUnique.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await service.isEligibleToTrackClicks(userId);

      // Assert
      expect(result).toBe(false);
    });
  });
});

// End of unit tests for: isEligibleToTrackClicks
