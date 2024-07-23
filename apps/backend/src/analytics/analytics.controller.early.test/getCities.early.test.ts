import { NotFoundException } from '@nestjs/common';
import { AnalyticsController } from '../analytics.controller';
import { UserContext } from '../../auth/interfaces/user-context';

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

describe('AnalyticsController.getCities() getCities method', () => {
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
    it('should return grouped city data for a valid key and user', async () => {
      // Arrange
      const key = 'valid-key';
      const days = 7;
      const link = { id: 'link-id', url: 'http://example.com' };
      const groupedData = [{ city: 'City1', count: 10 }];

      jest.spyOn(mockPrismaService.link, 'findUnique').mockResolvedValue(link);
      jest.spyOn(mockAnalyticsService, 'getGroupedByField').mockResolvedValue(groupedData);

      // Act
      const result = await analyticsController.getCities(key, days, mockUserContext as UserContext);

      // Assert
      expect(result).toEqual({ url: link.url, data: groupedData });
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
      expect(mockAnalyticsService.getGroupedByField).toHaveBeenCalledWith(link.id, 'city', days, { country: true });
    });
  });

  describe('Edge Cases', () => {
    it('should throw NotFoundException if link is not found', async () => {
      // Arrange
      const key = 'invalid-key';
      const days = 7;

      jest.spyOn(mockPrismaService.link, 'findUnique').mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(analyticsController.getCities(key, days, mockUserContext as any)).rejects.toThrow(NotFoundException);
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

      jest.spyOn(mockPrismaService.link, 'findUnique').mockResolvedValue(link as any as never);
      jest.spyOn(mockAnalyticsService, 'getGroupedByField').mockResolvedValue(groupedData as any as never);

      // Act
      const result = await analyticsController.getCities(key, days, mockUserContext as any);

      // Assert
      expect(result).toEqual({ url: link.url, data: groupedData });
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
      expect(mockAnalyticsService.getGroupedByField).toHaveBeenCalledWith(link.id, 'city', days, { country: true });
    });

    it('should handle errors from analyticsService gracefully', async () => {
      // Arrange
      const key = 'valid-key';
      const days = 7;
      const link = { id: 'link-id', url: 'http://example.com' };

      jest.spyOn(mockPrismaService.link, 'findUnique').mockResolvedValue(link as any as never);
      jest.spyOn(mockAnalyticsService, 'getGroupedByField').mockRejectedValue(new Error('Service Error') as never);

      // Act & Assert
      await expect(analyticsController.getCities(key, days, mockUserContext as any)).rejects.toThrow('Service Error');
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
      expect(mockAnalyticsService.getGroupedByField).toHaveBeenCalledWith(link.id, 'city', days, { country: true });
    });
  });
});
