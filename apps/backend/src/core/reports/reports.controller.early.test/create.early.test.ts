// Unit tests for: create

import { BadRequestException, NotFoundException } from '@nestjs/common';

import { Report } from '@reduced.to/prisma';

import { CreateReportDto } from '../dto';

import { ReportsController } from '../reports.controller';

class MockReportsService {
  isUrlReportable = jest.fn();
  create = jest.fn();
}

class MockLinksService {
  findBy = jest.fn();
}

class MockAppCacheService {}

describe('ReportsController.create() create method', () => {
  let reportsController: ReportsController;
  let mockReportsService: MockReportsService;
  let mockLinksService: MockLinksService;
  let mockCacheService: MockAppCacheService;

  beforeEach(() => {
    mockReportsService = new MockReportsService();
    mockLinksService = new MockLinksService();
    mockCacheService = new MockAppCacheService();
    reportsController = new ReportsController(mockReportsService as any, mockLinksService as any, mockCacheService as any);
  });

  describe('create', () => {
    it('should create a report successfully when valid data is provided', async () => {
      // Arrange
      const createReportDto: CreateReportDto = {
        link: 'https://shortened.link/abc123',
        category: 'Spam',
      };
      const report: Report = { id: '1', ...createReportDto } as any;

      mockReportsService.isUrlReportable.mockReturnValue(true);
      mockLinksService.findBy.mockResolvedValue({ key: 'abc123' } as any);
      mockReportsService.create.mockResolvedValue(report as any);

      // Act
      const result = await reportsController.create(createReportDto);

      // Assert
      expect(result).toEqual(report);
      expect(mockReportsService.isUrlReportable).toHaveBeenCalledWith(createReportDto.link);
      expect(mockLinksService.findBy).toHaveBeenCalledWith({ key: 'abc123' });
      expect(mockReportsService.create).toHaveBeenCalledWith({ key: 'abc123', category: 'Spam' });
    });

    it('should throw BadRequestException if the link is not reportable', async () => {
      // Arrange
      const createReportDto: CreateReportDto = {
        link: 'https://notshortened.link/xyz456',
        category: 'Spam',
      };

      mockReportsService.isUrlReportable.mockReturnValue(false);

      // Act & Assert
      await expect(reportsController.create(createReportDto)).rejects.toThrow(BadRequestException);
      expect(mockReportsService.isUrlReportable).toHaveBeenCalledWith(createReportDto.link);
    });

    it('should throw NotFoundException if the link does not exist', async () => {
      // Arrange
      const createReportDto: CreateReportDto = {
        link: 'https://shortened.link/abc123',
        category: 'Spam',
      };

      mockReportsService.isUrlReportable.mockReturnValue(true);
      mockLinksService.findBy.mockResolvedValue(null);

      // Act & Assert
      await expect(reportsController.create(createReportDto)).rejects.toThrow(NotFoundException);
      expect(mockReportsService.isUrlReportable).toHaveBeenCalledWith(createReportDto.link);
      expect(mockLinksService.findBy).toHaveBeenCalledWith({ key: 'abc123' });
    });

    it('should throw NotFoundException if the link is expired', async () => {
      // Arrange
      const createReportDto: CreateReportDto = {
        link: 'https://shortened.link/expired123',
        category: 'Spam',
      };

      mockReportsService.isUrlReportable.mockReturnValue(true);
      mockLinksService.findBy.mockResolvedValue({ key: 'expired123' } as any);
      mockReportsService.create.mockResolvedValue(null);

      // Act & Assert
      await expect(reportsController.create(createReportDto)).rejects.toThrow(NotFoundException);
      expect(mockReportsService.isUrlReportable).toHaveBeenCalledWith(createReportDto.link);
      expect(mockLinksService.findBy).toHaveBeenCalledWith({ key: 'expired123' });
    });
  });
});

// End of unit tests for: create
