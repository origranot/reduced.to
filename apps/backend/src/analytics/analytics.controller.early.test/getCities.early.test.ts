// Unit tests for: getCities

import { NotFoundException } from '@nestjs/common';

import { AnalyticsService } from '../analytics.service';

import { PrismaService } from '@reduced.to/prisma';

import { AnalyticsController } from '../analytics.controller';

import { Test, TestingModule } from '@nestjs/testing';

// Mock UserContext interface
interface MockUserContext {
  id: string;
}

// Mock AnalyticsService class
class MockAnalyticsService {
  getGroupedByField = jest.fn();
}

// Mock PrismaService class
class MockPrismaService {
  link = {
    findUnique: jest.fn(),
  };
}

describe('AnalyticsController.getCities() getCities method', () => {
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
    it('should return grouped city data successfully', async () => {
      // Arrange
      const key = 'test-key';
      const days = 30;
      const mockLink = { id: 'link-id', url: 'http://example.com' };
      const mockData = [
        { city: 'City1', count: 10 },
        { city: 'City2', count: 5 },
      ];

      mockPrismaService.link.findUnique.mockResolvedValue(mockLink as any);
      mockAnalyticsService.getGroupedByField.mockResolvedValue(mockData as any);

      // Act
      const result = await controller.getCities(key, days, mockUserContext as any);

      // Assert
      expect(result).toEqual({ url: mockLink.url, data: mockData });
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
      expect(mockAnalyticsService.getGroupedByField).toHaveBeenCalledWith(mockLink.id, 'city', days, { country: true });
    });
  });

  describe('Edge Cases', () => {
    it('should throw NotFoundException if link is not found', async () => {
      // Arrange
      const key = 'non-existent-key';
      const days = 30;

      mockPrismaService.link.findUnique.mockResolvedValue(null as any);

      // Act & Assert
      await expect(controller.getCities(key, days, mockUserContext as any)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
    });

    it('should handle errors from analytics service gracefully', async () => {
      // Arrange
      const key = 'test-key';
      const days = 30;
      const mockLink = { id: 'link-id', url: 'http://example.com' };

      mockPrismaService.link.findUnique.mockResolvedValue(mockLink as any);
      mockAnalyticsService.getGroupedByField.mockRejectedValue(new Error('Service error'));

      // Act & Assert
      await expect(controller.getCities(key, days, mockUserContext as any)).rejects.toThrow('Service error');
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: mockUserContext.id },
        select: { id: true, url: true },
      });
    });
  });
});

// End of unit tests for: getCities
