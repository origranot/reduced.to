// Unit tests for: delete

import { Report } from '@reduced.to/prisma';

import { ReportsService } from '../reports.service';

import { NotFoundException } from '@nestjs/common';

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    front: {
      domain: 'example.com',
    },
  });
}

class MockPrismaService {
  public report = {
    delete: jest.fn(),
    findUnique: jest.fn(),
  };
}

describe('ReportsService.delete() delete method', () => {
  let reportsService: ReportsService;
  let mockPrismaService: MockPrismaService;
  let mockAppConfigService: MockAppConfigService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService() as any;
    mockAppConfigService = new MockAppConfigService() as any;
    reportsService = new ReportsService(mockAppConfigService, mockPrismaService);
  });

  describe('Happy Path', () => {
    it('should delete a report successfully', async () => {
      // Arrange
      const reportId = '123';
      const mockReport: Report = { id: reportId, link: null, category: '', createdAt: new Date() } as any;
      mockPrismaService.report.findUnique.mockResolvedValue(mockReport);
      mockPrismaService.report.delete.mockResolvedValue(mockReport);

      // Act
      const result = await reportsService.delete(reportId);

      // Assert
      expect(mockPrismaService.report.findUnique).toHaveBeenCalledWith({ where: { id: reportId } });
      expect(mockPrismaService.report.delete).toHaveBeenCalledWith({ where: { id: reportId } });
      expect(result).toEqual(mockReport);
    });
  });

  describe('Edge Cases', () => {
    it('should throw NotFoundException if report does not exist', async () => {
      // Arrange
      const reportId = 'non-existent-id';
      mockPrismaService.report.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(reportsService.delete(reportId)).rejects.toThrow(NotFoundException);
      await expect(reportsService.delete(reportId)).rejects.toThrow('This report does not exist.');
    });

    it('should handle errors thrown by PrismaService', async () => {
      // Arrange
      const reportId = '123';
      const mockReport: Report = { id: reportId, link: null, category: '', createdAt: new Date() } as any;
      mockPrismaService.report.findUnique.mockResolvedValue(mockReport);
      mockPrismaService.report.delete.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(reportsService.delete(reportId)).rejects.toThrow('Database error');
    });
  });
});

// End of unit tests for: delete
