import { NotFoundException } from '@nestjs/common';
import { AnalyticsService } from '../analytics.service';
import { PrismaService } from '@reduced.to/prisma';
import { AnalyticsController } from '../analytics.controller';
import { Test, TestingModule } from '@nestjs/testing';

interface MockUserContext {
  id: string;
}

class MockAnalyticsService {
  getClicksOverTime = jest.fn();
}

class MockPrismaService {
  link = {
    findUnique: jest.fn(),
  };
}

describe('AnalyticsController.getAnalytics() getAnalytics method', () => {
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
    it('should return analytics data for a valid key and user', async () => {
      // Arrange
      const key = 'valid-key';
      const days = 7;
      const link = { id: 'link-id', url: 'http://example.com' };
      const clicksOverTime = [{ date: '2023-01-01', clicks: 10 }];

      mockPrismaService.link.findUnique.mockResolvedValue(link as any as never);
      mockAnalyticsService.getClicksOverTime.mockResolvedValue(clicksOverTime as any as never);

      // Act
      const result = await controller.getAnalytics(key, days, mockUserContext as any);

      // Assert
      expect(result).toEqual({ url: link.url, clicksOverTime });
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
      expect(mockAnalyticsService.getClicksOverTime).toHaveBeenCalledWith(link.id, days);
    });
  });

  describe('Edge Cases', () => {
    it('should throw NotFoundException if link is not found', async () => {
      // Arrange
      const key = 'invalid-key';
      const days = 7;

      mockPrismaService.link.findUnique.mockResolvedValue(null as any as never);

      // Act & Assert
      await expect(controller.getAnalytics(key, days, mockUserContext as any)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
    });

    it('should handle zero days gracefully', async () => {
      // Arrange
      const key = 'valid-key';
      const days = 0;
      const link = { id: 'link-id', url: 'http://example.com' };
      const clicksOverTime = [{ date: '2023-01-01', clicks: 10 }];

      mockPrismaService.link.findUnique.mockResolvedValue(link as any as never);
      mockAnalyticsService.getClicksOverTime.mockResolvedValue(clicksOverTime as any as never);

      // Act
      const result = await controller.getAnalytics(key, days, mockUserContext as any);

      // Assert
      expect(result).toEqual({ url: link.url, clicksOverTime });
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
      expect(mockAnalyticsService.getClicksOverTime).toHaveBeenCalledWith(link.id, days);
    });

    it('should handle negative days gracefully', async () => {
      // Arrange
      const key = 'valid-key';
      const days = -5;
      const link = { id: 'link-id', url: 'http://example.com' };
      const clicksOverTime = [{ date: '2023-01-01', clicks: 10 }];

      mockPrismaService.link.findUnique.mockResolvedValue(link as any as never);
      mockAnalyticsService.getClicksOverTime.mockResolvedValue(clicksOverTime as any as never);

      // Act
      const result = await controller.getAnalytics(key, days, mockUserContext as any);

      // Assert
      expect(result).toEqual({ url: link.url, clicksOverTime });
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
      expect(mockAnalyticsService.getClicksOverTime).toHaveBeenCalledWith(link.id, days);
    });
  });
});
