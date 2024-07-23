import { NotFoundException } from '@nestjs/common';
import { AnalyticsService } from '../analytics.service';
import { PrismaService } from '@reduced.to/prisma';
import { AnalyticsController } from '../analytics.controller';
import { Test, TestingModule } from '@nestjs/testing';

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

describe('AnalyticsController.getRegions() getRegions method', () => {
  let controller: AnalyticsController;
  let mockAnalyticsService: MockAnalyticsService;
  let mockPrismaService: MockPrismaService;
  let mockUserContext: MockUserContext;

  beforeEach(async () => {
    mockAnalyticsService = new MockAnalyticsService();
    mockPrismaService = new MockPrismaService();
    mockUserContext = { id: 'user-id' };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        { provide: AnalyticsService, useValue: mockAnalyticsService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
  });

  describe('Happy Path', () => {
    it('should return grouped data by region', async () => {
      // Arrange
      const key = 'test-key';
      const days = 7;
      const link = { id: 'link-id', url: 'http://example.com' };
      const groupedData = [{ region: 'Region1', count: 10 }];

      mockPrismaService.link.findUnique.mockResolvedValue(link as any as never);
      mockAnalyticsService.getGroupedByField.mockResolvedValue(groupedData as any as never);

      // Act
      const result = await controller.getRegions(key, days, mockUserContext as any);

      // Assert
      expect(result).toEqual({ url: link.url, data: groupedData });
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
      expect(mockAnalyticsService.getGroupedByField).toHaveBeenCalledWith(link.id, 'region', days, undefined);
    });
  });

  describe('Edge Cases', () => {
    it('should throw NotFoundException if link is not found', async () => {
      // Arrange
      const key = 'invalid-key';
      const days = 7;

      mockPrismaService.link.findUnique.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(controller.getRegions(key, days, mockUserContext as any)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
    });

    it('should handle empty grouped data', async () => {
      // Arrange
      const key = 'test-key';
      const days = 7;
      const link = { id: 'link-id', url: 'http://example.com' };
      const groupedData = [];

      mockPrismaService.link.findUnique.mockResolvedValue(link as any as never);
      mockAnalyticsService.getGroupedByField.mockResolvedValue(groupedData as any as never);

      // Act
      const result = await controller.getRegions(key, days, mockUserContext as any);

      // Assert
      expect(result).toEqual({ url: link.url, data: groupedData });
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
      expect(mockAnalyticsService.getGroupedByField).toHaveBeenCalledWith(link.id, 'region', days, undefined);
    });

    it('should handle negative days value', async () => {
      // Arrange
      const key = 'test-key';
      const days = -1;
      const link = { id: 'link-id', url: 'http://example.com' };
      const groupedData = [{ region: 'Region1', count: 10 }];

      mockPrismaService.link.findUnique.mockResolvedValue(link as any as never);
      mockAnalyticsService.getGroupedByField.mockResolvedValue(groupedData as any as never);

      // Act
      const result = await controller.getRegions(key, days, mockUserContext as any);

      // Assert
      expect(result).toEqual({ url: link.url, data: groupedData });
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
      expect(mockAnalyticsService.getGroupedByField).toHaveBeenCalledWith(link.id, 'region', days, undefined);
    });
  });
});
