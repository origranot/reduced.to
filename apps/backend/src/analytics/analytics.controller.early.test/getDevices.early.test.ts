// Unit tests for: getDevices

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

describe('AnalyticsController.getDevices() getDevices method', () => {
  let controller: AnalyticsController;
  let mockAnalyticsService: MockAnalyticsService;
  let mockPrismaService: MockPrismaService;

  beforeEach(async () => {
    mockAnalyticsService = new MockAnalyticsService();
    mockPrismaService = new MockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        { provide: AnalyticsService, useValue: mockAnalyticsService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
  });

  describe('getDevices', () => {
    const key = 'test-key';
    const days = 7;
    const user: MockUserContext = { id: 'user-id' };

    beforeEach(() => {
      // Reset mocks before each test
      jest.clearAllMocks();
    });

    it('should return grouped device data for valid key and user', async () => {
      // Arrange
      const mockLink = { id: 'link-id', url: 'http://example.com' };
      const mockData = { device: 'mobile', count: 10 };

      mockPrismaService.link.findUnique.mockResolvedValue(mockLink as any);
      mockAnalyticsService.getGroupedByField.mockResolvedValue(mockData as any);

      // Act
      const result = await controller.getDevices(key, days, user as any);

      // Assert
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: user.id },
        select: { id: true, url: true },
      });
      expect(mockAnalyticsService.getGroupedByField).toHaveBeenCalledWith(mockLink.id, 'device', days, undefined);
      expect(result).toEqual({ url: mockLink.url, data: mockData });
    });

    it('should throw NotFoundException if link is not found', async () => {
      // Arrange
      mockPrismaService.link.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(controller.getDevices(key, days, user as any)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: user.id },
        select: { id: true, url: true },
      });
    });

    it('should handle errors from analytics service gracefully', async () => {
      // Arrange
      const mockLink = { id: 'link-id', url: 'http://example.com' };
      mockPrismaService.link.findUnique.mockResolvedValue(mockLink as any);
      mockAnalyticsService.getGroupedByField.mockRejectedValue(new Error('Service error'));

      // Act & Assert
      await expect(controller.getDevices(key, days, user as any)).rejects.toThrow('Service error');
      expect(mockPrismaService.link.findUnique).toHaveBeenCalledWith({
        where: { key, userId: user.id },
        select: { id: true, url: true },
      });
    });

    it('should call getGroupedByField with correct parameters', async () => {
      // Arrange
      const mockLink = { id: 'link-id', url: 'http://example.com' };
      mockPrismaService.link.findUnique.mockResolvedValue(mockLink as any);
      mockAnalyticsService.getGroupedByField.mockResolvedValue({} as any);

      // Act
      await controller.getDevices(key, days, user as any);

      // Assert
      expect(mockAnalyticsService.getGroupedByField).toHaveBeenCalledWith(mockLink.id, 'device', days, undefined);
    });
  });
});

// End of unit tests for: getDevices
