// Unit tests for: findById

import { Report } from '@reduced.to/prisma';

import { ReportsService } from '../reports.service';

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    front: {
      domain: 'example.com',
    },
  });
}

class MockPrismaService {
  public report = {
    findUnique: jest.fn(),
  };
}

describe('ReportsService.findById() findById method', () => {
  let reportsService: ReportsService;
  let mockPrismaService: MockPrismaService;
  let mockAppConfigService: MockAppConfigService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService() as any;
    mockAppConfigService = new MockAppConfigService() as any;
    reportsService = new ReportsService(mockAppConfigService, mockPrismaService);
  });

  describe('Happy Path', () => {
    it('should return a report when a valid ID is provided', async () => {
      // Arrange
      const reportId = 'valid-id';
      const mockReport: Report = {
        id: reportId,
        link: {
          url: 'http://example.com/report',
          key: 'report-key',
        },
        category: 'category',
        createdAt: new Date(),
      } as any;

      mockPrismaService.report.findUnique.mockResolvedValue(mockReport);

      // Act
      const result = await reportsService.findById(reportId);

      // Assert
      expect(result).toEqual(mockReport);
      expect(mockPrismaService.report.findUnique).toHaveBeenCalledWith({
        where: { id: reportId },
        include: { link: true },
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return null when an invalid ID is provided', async () => {
      // Arrange
      const invalidId = 'invalid-id';
      mockPrismaService.report.findUnique.mockResolvedValue(null);

      // Act
      const result = await reportsService.findById(invalidId);

      // Assert
      expect(result).toBeNull();
      expect(mockPrismaService.report.findUnique).toHaveBeenCalledWith({
        where: { id: invalidId },
        include: { link: true },
      });
    });

    it('should handle errors thrown by the Prisma service', async () => {
      // Arrange
      const reportId = 'error-id';
      const errorMessage = 'Database error';
      mockPrismaService.report.findUnique.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(reportsService.findById(reportId)).rejects.toThrow(errorMessage);
      expect(mockPrismaService.report.findUnique).toHaveBeenCalledWith({
        where: { id: reportId },
        include: { link: true },
      });
    });

    it('should handle empty string as an ID', async () => {
      // Arrange
      const emptyId = '';
      mockPrismaService.report.findUnique.mockResolvedValue(null);

      // Act
      const result = await reportsService.findById(emptyId);

      // Assert
      expect(result).toBeNull();
      expect(mockPrismaService.report.findUnique).toHaveBeenCalledWith({
        where: { id: emptyId },
        include: { link: true },
      });
    });
  });
});

// End of unit tests for: findById
