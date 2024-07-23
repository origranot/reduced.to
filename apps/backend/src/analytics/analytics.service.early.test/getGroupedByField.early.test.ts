import { sub } from 'date-fns';
import { AnalyticsService } from '../analytics.service';

class MockAppLoggerService {
  log = jest.fn();
  error = jest.fn();
}

class MockPrismaService {
  $queryRawUnsafe = jest.fn();
}

describe('AnalyticsService.getGroupedByField() getGroupedByField method', () => {
  let service: AnalyticsService;
  let mockLogger: MockAppLoggerService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockLogger = new MockAppLoggerService();
    mockPrismaService = new MockPrismaService();
    service = new AnalyticsService(mockLogger as any, mockPrismaService as any);
  });

  describe('Happy Path', () => {
    it('should return grouped data by field with default durationDays', async () => {
      // Arrange
      const linkId = 'test-link-id';
      const field = 'test-field';
      const durationDays = 30;
      const fromDate = sub(new Date(), { days: durationDays });
      const mockResult = [{ field: 'test-value', count: '10' }];
      mockPrismaService.$queryRawUnsafe.mockResolvedValue(mockResult as any as never);

      // Act
      const result = await service.getGroupedByField(linkId, field);

      // Assert
      expect(result).toEqual(mockResult);
      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalledWith(expect.any(String), linkId, fromDate);
    });

    it('should return grouped data by field with specified durationDays', async () => {
      // Arrange
      const linkId = 'test-link-id';
      const field = 'test-field';
      const durationDays = 7;
      const fromDate = sub(new Date(), { days: durationDays });
      const mockResult = [{ field: 'test-value', count: '5' }];
      mockPrismaService.$queryRawUnsafe.mockResolvedValue(mockResult as any as never);

      // Act
      const result = await service.getGroupedByField(linkId, field, durationDays);

      // Assert
      expect(result).toEqual(mockResult);
      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalledWith(expect.any(String), linkId, fromDate);
    });

    it('should include additional fields in the query if provided', async () => {
      // Arrange
      const linkId = 'test-link-id';
      const field = 'test-field';
      const durationDays = 30;
      const include = { additionalField: true };
      const fromDate = sub(new Date(), { days: durationDays });
      const mockResult = [{ field: 'test-value', count: '10', additionalField: 'extra-value' }];
      mockPrismaService.$queryRawUnsafe.mockResolvedValue(mockResult as any as never);

      // Act
      const result = await service.getGroupedByField(linkId, field, durationDays, include);

      // Assert
      expect(result).toEqual(mockResult);
      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalledWith(expect.any(String), linkId, fromDate);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty result set gracefully', async () => {
      // Arrange
      const linkId = 'test-link-id';
      const field = 'test-field';
      const durationDays = 30;
      const fromDate = sub(new Date(), { days: durationDays });
      const mockResult: any[] = [];
      mockPrismaService.$queryRawUnsafe.mockResolvedValue(mockResult as any as never);

      // Act
      const result = await service.getGroupedByField(linkId, field);

      // Assert
      expect(result).toEqual(mockResult);
      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalledWith(expect.any(String), linkId, fromDate);
    });

    it('should handle invalid field gracefully', async () => {
      // Arrange
      const linkId = 'test-link-id';
      const field = 'invalid-field';
      const durationDays = 30;
      const fromDate = sub(new Date(), { days: durationDays });
      mockPrismaService.$queryRawUnsafe.mockRejectedValue(new Error('Invalid field') as never);

      // Act & Assert
      await expect(service.getGroupedByField(linkId, field)).rejects.toThrow('Invalid field');
      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalledWith(expect.any(String), linkId, fromDate);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const linkId = 'test-link-id';
      const field = 'test-field';
      const durationDays = 30;
      const fromDate = sub(new Date(), { days: durationDays });
      mockPrismaService.$queryRawUnsafe.mockRejectedValue(new Error('Database error') as never);

      // Act & Assert
      await expect(service.getGroupedByField(linkId, field)).rejects.toThrow('Database error');
      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalledWith(expect.any(String), linkId, fromDate);
    });
  });
});
