import { NotFoundException } from '@nestjs/common';
import { AnalyticsController } from '../analytics.controller';

interface MockUserContext {
  id: string;
}

class MockAnalyticsService {
  public getGroupedByField = jest.fn();
}

class MockPrismaService {
  public link = {
    findUnique: jest.fn(),
  };
}

describe('AnalyticsController.getDevices() getDevices method', () => {
  let analyticsController: AnalyticsController;
  let mockAnalyticsService: MockAnalyticsService;
  let mockPrismaService: MockPrismaService;
  let mockUserContext: MockUserContext;

  beforeEach(() => {
    mockAnalyticsService = new MockAnalyticsService();
    mockPrismaService = new MockPrismaService();
    mockUserContext = { id: 'user-id' };

    analyticsController = new AnalyticsController(mockAnalyticsService as any, mockPrismaService as any);
  });

  describe('Happy Path', () => {
    it('should return grouped device data for a valid key and user', async () => {
      // Arrange
      const key = 'valid-key';
      const days = 7;
      const link = { id: 'link-id', url: 'http://example.com' };
      const groupedData = [{ device: 'mobile', count: 10 }];

      mockPrismaService.link.findUnique.mockResolvedValue(link as any as never);
      mockAnalyticsService.getGroupedByField.mockResolvedValue(groupedData as any as never);

      // Act
      const result = await analyticsController.getDevices(key, days, mockUserContext as any);

      // Assert
      expect(result).toEqual({ url: link.url, data: groupedData });
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
      expect(mockAnalyticsService.getGroupedByField).toHaveBeenCalledWith(link.id, 'device', days, undefined);
    });
  });

  describe('Edge Cases', () => {
    it('should throw NotFoundException if the link is not found', async () => {
      // Arrange
      const key = 'invalid-key';
      const days = 7;

      mockPrismaService.link.findUnique.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(analyticsController.getDevices(key, days, mockUserContext as any)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
    });

    it('should handle empty grouped data gracefully', async () => {
      // Arrange
      const key = 'valid-key';
      const days = 7;
      const link = { id: 'link-id', url: 'http://example.com' };
      const groupedData: any[] = [];

      mockPrismaService.link.findUnique.mockResolvedValue(link as any as never);
      mockAnalyticsService.getGroupedByField.mockResolvedValue(groupedData as any as never);

      // Act
      const result = await analyticsController.getDevices(key, days, mockUserContext as any);

      // Assert
      expect(result).toEqual({ url: link.url, data: groupedData });
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
      expect(mockAnalyticsService.getGroupedByField).toHaveBeenCalledWith(link.id, 'device', days, undefined);
    });

    it('should handle negative days parameter gracefully', async () => {
      // Arrange
      const key = 'valid-key';
      const days = -1;
      const link = { id: 'link-id', url: 'http://example.com' };
      const groupedData = [{ device: 'mobile', count: 10 }];

      mockPrismaService.link.findUnique.mockResolvedValue(link as any as never);
      mockAnalyticsService.getGroupedByField.mockResolvedValue(groupedData as any as never);

      // Act
      const result = await analyticsController.getDevices(key, days, mockUserContext as any);

      // Assert
      expect(result).toEqual({ url: link.url, data: groupedData });
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
      expect(mockAnalyticsService.getGroupedByField).toHaveBeenCalledWith(link.id, 'device', days, undefined);
    });
  });
});
