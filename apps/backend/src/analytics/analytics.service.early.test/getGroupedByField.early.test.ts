// Unit tests for: getGroupedByField

import { AnalyticsService } from '../analytics.service';

class MockAppLoggerService {
  log = jest.fn();
  error = jest.fn();
}

class MockPrismaService {
  $queryRawUnsafe = jest.fn();
}

describe('AnalyticsService.getGroupedByField() getGroupedByField method', () => {
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
    it('should return grouped data when valid parameters are provided', async () => {
      const linkId = 'link123';
      const field = 'fieldName';
      const durationDays = 30;
      const mockResponse = [
        { field: 'value1', count: '10' },
        { field: 'value2', count: '5' },
      ];

      mockPrismaService.$queryRawUnsafe.mockResolvedValue(mockResponse as any);

      const result = await analyticsService.getGroupedByField(linkId, field, durationDays);

      expect(result).toEqual(mockResponse);
      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalledWith(expect.any(String), linkId, expect.any(Date));
    });

    it('should return grouped data with include fields when provided', async () => {
      const linkId = 'link123';
      const field = 'fieldName';
      const durationDays = 30;
      const include = { includeField1: true, includeField2: true };
      const mockResponse = [
        { field: 'value1', count: '10' },
        { field: 'value2', count: '5' },
      ];

      mockPrismaService.$queryRawUnsafe.mockResolvedValue(mockResponse as any);

      const result = await analyticsService.getGroupedByField(linkId, field, durationDays, include);

      expect(result).toEqual(mockResponse);
      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalledWith(expect.any(String), linkId, expect.any(Date));
    });
  });

  // Edge Cases Tests
  describe('Edge Cases', () => {
    it('should handle empty include fields gracefully', async () => {
      const linkId = 'link123';
      const field = 'fieldName';
      const durationDays = 30;
      const mockResponse = [{ field: 'value1', count: '10' }];

      mockPrismaService.$queryRawUnsafe.mockResolvedValue(mockResponse as any);

      const result = await analyticsService.getGroupedByField(linkId, field, durationDays, {});

      expect(result).toEqual(mockResponse);
      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalledWith(expect.any(String), linkId, expect.any(Date));
    });

    it('should throw an error if the database query fails', async () => {
      const linkId = 'link123';
      const field = 'fieldName';
      const durationDays = 30;

      mockPrismaService.$queryRawUnsafe.mockRejectedValue(new Error('Database error'));

      await expect(analyticsService.getGroupedByField(linkId, field, durationDays)).rejects.toThrow('Database error');
    });

    it('should handle a duration of zero days', async () => {
      const linkId = 'link123';
      const field = 'fieldName';
      const durationDays = 0;
      const mockResponse = [{ field: 'value1', count: '10' }];

      mockPrismaService.$queryRawUnsafe.mockResolvedValue(mockResponse as any);

      const result = await analyticsService.getGroupedByField(linkId, field, durationDays);

      expect(result).toEqual(mockResponse);
      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalledWith(expect.any(String), linkId, expect.any(Date));
    });

    it('should handle invalid field names gracefully', async () => {
      const linkId = 'link123';
      const field = 'invalidFieldName';
      const durationDays = 30;
      const mockResponse = [];

      mockPrismaService.$queryRawUnsafe.mockResolvedValue(mockResponse as any);

      const result = await analyticsService.getGroupedByField(linkId, field, durationDays);

      expect(result).toEqual(mockResponse);
      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalledWith(expect.any(String), linkId, expect.any(Date));
    });
  });
});

// End of unit tests for: getGroupedByField
