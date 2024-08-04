// Unit tests for: create

import { ReportsService } from '../reports.service';

import { BadRequestException, NotFoundException } from '@nestjs/common';

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    front: {
      domain: 'reduced.to',
    },
  });
}

class MockPrismaService {
  public report = {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  };
}

describe('ReportsService.create() create method', () => {
  let reportsService: ReportsService;
  let mockAppConfigService: MockAppConfigService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockAppConfigService = new MockAppConfigService();
    mockPrismaService = new MockPrismaService();
    reportsService = new ReportsService(mockAppConfigService as any, mockPrismaService as any);
  });

  describe('create', () => {
    it('should successfully create a report when valid data is provided', async () => {
      // Arrange
      const key = 'some-key';
      const category = 'some-category';
      const createReportDto = { key, category };

      mockPrismaService.report.create.mockResolvedValue({ id: '1', ...createReportDto } as any);
      jest.spyOn(reportsService, 'isUrlReportable').mockReturnValue(true);
      jest.spyOn(reportsService, 'findById').mockResolvedValue({ key } as any);

      // Act
      const result = await reportsService.create(createReportDto);

      // Assert
      expect(result).toEqual({ id: '1', ...createReportDto });
      expect(mockPrismaService.report.create).toHaveBeenCalledWith({
        data: {
          link: {
            connect: {
              key,
            },
          },
          category,
        },
      });
    });

    it('should throw BadRequestException if the URL is not reportable', async () => {
      // Arrange
      const createReportDto = { key: 'some-key', category: 'some-category' };
      jest.spyOn(reportsService, 'isUrlReportable').mockReturnValue(false);

      // Act & Assert
      await expect(reportsService.create(createReportDto)).rejects.toThrow(BadRequestException);
      await expect(reportsService.create(createReportDto)).rejects.toThrow('You can only report links that are shortened by us.');
    });

    it('should throw NotFoundException if the link does not exist', async () => {
      // Arrange
      const key = 'some-key';
      const category = 'some-category';
      const createReportDto = { key, category };

      jest.spyOn(reportsService, 'isUrlReportable').mockReturnValue(true);
      jest.spyOn(reportsService, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(reportsService.create(createReportDto)).rejects.toThrow(NotFoundException);
      await expect(reportsService.create(createReportDto)).rejects.toThrow('This link might be expired or does not exist.');
    });

    it('should handle edge case of missing category', async () => {
      // Arrange
      const key = 'some-key';
      const createReportDto = { key, category: undefined }; // Edge case: missing category

      jest.spyOn(reportsService, 'isUrlReportable').mockReturnValue(true);
      mockPrismaService.report.create.mockResolvedValue({ id: '1', ...createReportDto } as any);

      // Act
      const result = await reportsService.create(createReportDto);

      // Assert
      expect(result).toEqual({ id: '1', ...createReportDto });
      expect(mockPrismaService.report.create).toHaveBeenCalledWith({
        data: {
          link: {
            connect: {
              key,
            },
          },
          category: undefined,
        },
      });
    });
  });
});

// End of unit tests for: create
