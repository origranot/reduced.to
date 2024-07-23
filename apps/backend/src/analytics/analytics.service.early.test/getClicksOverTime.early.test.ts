import { sub } from 'date-fns';
import { AnalyticsService } from '../analytics.service';

class MockAppLoggerService {
  log = jest.fn();
  error = jest.fn();
}

class MockPrismaService {
  $queryRaw = jest.fn();
}

describe('AnalyticsService.getClicksOverTime() getClicksOverTime method', () => {
  let analyticsService: AnalyticsService;
  let mockLogger: MockAppLoggerService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockLogger = new MockAppLoggerService();
    mockPrismaService = new MockPrismaService();
    analyticsService = new AnalyticsService(mockLogger as any, mockPrismaService as any);
  });

  describe('Happy Path', () => {
    it('should return clicks over time for the given linkId and durationDays', async () => {
      // Arrange
      const linkId = 'test-link-id';
      const durationDays = 30;
      const fromDate = sub(new Date(), { days: durationDays });
      const expectedResult = [
        { day: '2023-10-01', count: '10' },
        { day: '2023-10-02', count: '20' },
      ];

      mockPrismaService.$queryRaw.mockResolvedValue(expectedResult as any as never);

      // Act
      const result = await analyticsService.getClicksOverTime(linkId, durationDays);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.$queryRaw).toHaveBeenCalledWith(expect.any(Array), "day", linkId, fromDate);
    });

    it('should default to 30 days if durationDays is not provided', async () => {
      // Arrange
      const linkId = 'test-link-id';
      const fromDate = sub(new Date(), { days: 30 });
      const expectedResult = [
        { day: '2023-10-01', count: '10' },
        { day: '2023-10-02', count: '20' },
      ];

      mockPrismaService.$queryRaw.mockResolvedValue(expectedResult as any as never);

      // Act
      const result = await analyticsService.getClicksOverTime(linkId);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.$queryRaw).toHaveBeenCalledWith(expect.any(Array), "day", linkId, fromDate);
    });
  });

  describe('Edge Cases', () => {
    it('should handle no clicks data gracefully', async () => {
      // Arrange
      const linkId = 'test-link-id';
      const durationDays = 30;
      const fromDate = sub(new Date(), { days: durationDays });
      const expectedResult: { day: string; count: string }[] = [];

      mockPrismaService.$queryRaw.mockResolvedValue(expectedResult as any as never);

      // Act
      const result = await analyticsService.getClicksOverTime(linkId, durationDays);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.$queryRaw).toHaveBeenCalledWith(expect.any(Array), "day", linkId, fromDate);
    });

    it('should handle a duration of 1 day correctly', async () => {
      // Arrange
      const linkId = 'test-link-id';
      const durationDays = 1;
      const fromDate = sub(new Date(), { days: durationDays });
      const expectedResult = [
        { day: '2023-10-01 01:00:00', count: '5' },
        { day: '2023-10-01 02:00:00', count: '10' },
      ];

      mockPrismaService.$queryRaw.mockResolvedValue(expectedResult as any as never);

      // Acts
      const result = await analyticsService.getClicksOverTime(linkId, durationDays);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.$queryRaw).toHaveBeenCalledWith(expect.any(Array), "hour", linkId, fromDate);
    });

    it('should handle invalid linkId gracefully', async () => {
      // Arrange
      const linkId = 'invalid-link-id';
      const durationDays = 30;
      const fromDate = sub(new Date(), { days: durationDays });
      const expectedResult: { day: string; count: string }[] = [];

      mockPrismaService.$queryRaw.mockResolvedValue(expectedResult as any as never);

      // Act
      const result = await analyticsService.getClicksOverTime(linkId, durationDays);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.$queryRaw).toHaveBeenCalledWith(expect.any(Array), "day", linkId, fromDate);
    });

    it('should handle PrismaService errors gracefully', async () => {
      // Arrange
      const linkId = 'test-link-id';
      const durationDays = 30;
      const fromDate = sub(new Date(), { days: durationDays });

      mockPrismaService.$queryRaw.mockRejectedValue(new Error('PrismaService error') as never);

      // Act & Assert
      await expect(analyticsService.getClicksOverTime(linkId, durationDays)).rejects.toThrow('PrismaService error');
      expect(mockPrismaService.$queryRaw).toHaveBeenCalledWith(expect.any(Array), "day", linkId, fromDate);
    });
  });
});
