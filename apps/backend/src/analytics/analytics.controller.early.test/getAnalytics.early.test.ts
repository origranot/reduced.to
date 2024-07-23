// Unit tests for: getAnalytics

import { NotFoundException } from '@nestjs/common';

import { AnalyticsService } from '../analytics.service';

import { PrismaService } from '@reduced.to/prisma';

import { AnalyticsController } from '../analytics.controller';

import { Test, TestingModule } from '@nestjs/testing';

interface MockUserContext {
  id: string;
  // Add other properties as needed
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

  describe('getAnalytics', () => {
    it('should return analytics data for a valid key and days', async () => {
      // Arrange
      const key = 'valid-key';
      const days = 30;
      const mockLink = { id: 'link-id', url: 'http://example.com' };
      const mockClicksData = [1, 2, 3];

      mockPrismaService.link.findUnique.mockResolvedValue(mockLink as any);
      mockAnalyticsService.getClicksOverTime.mockResolvedValue(mockClicksData as any);

      // Act
      const result = await controller.getAnalytics(key, days, mockUserContext as any);

      // Assert
      expect(result).toEqual({ url: mockLink.url, clicksOverTime: mockClicksData });
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
      expect(mockAnalyticsService.getClicksOverTime).toHaveBeenCalledWith(mockLink.id, days);
    });

    it('should throw NotFoundException if link is not found', async () => {
      // Arrange
      const key = 'invalid-key';
      const days = 30;

      mockPrismaService.link.findUnique.mockResolvedValue(null as any);

      // Act & Assert
      await expect(controller.getAnalytics(key, days, mockUserContext as any)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
    });

    it('should handle errors from analytics service gracefully', async () => {
      // Arrange
      const key = 'valid-key';
      const days = 30;
      const mockLink = { id: 'link-id', url: 'http://example.com' };

      mockPrismaService.link.findUnique.mockResolvedValue(mockLink as any);
      mockAnalyticsService.getClicksOverTime.mockRejectedValue(new Error('Service error'));

      // Act & Assert
      await expect(controller.getAnalytics(key, days, mockUserContext as any)).rejects.toThrow('Service error');
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
    });

    it('should handle edge case with zero days', async () => {
      // Arrange
      const key = 'valid-key';
      const days = 0; // Edge case
      const mockLink = { id: 'link-id', url: 'http://example.com' };
      const mockClicksData = [];

      mockPrismaService.link.findUnique.mockResolvedValue(mockLink as any);
      mockAnalyticsService.getClicksOverTime.mockResolvedValue(mockClicksData as any);

      // Act
      const result = await controller.getAnalytics(key, days, mockUserContext as any);

      // Assert
      expect(result).toEqual({ url: mockLink.url, clicksOverTime: mockClicksData });
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
      expect(mockAnalyticsService.getClicksOverTime).toHaveBeenCalledWith(mockLink.id, days);
    });
  });
});

// End of unit tests for: getAnalytics
