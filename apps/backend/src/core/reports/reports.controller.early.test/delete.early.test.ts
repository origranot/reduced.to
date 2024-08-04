// Unit tests for: delete

import { NotFoundException } from '@nestjs/common';

import { ReportsController } from '../reports.controller';

class MockReportsService {
  public findById = jest.fn();
  public delete = jest.fn();
}

class MockLinksService {
  public delete = jest.fn();
}

class MockAppCacheService {
  public del = jest.fn();
}

describe('ReportsController.delete() delete method', () => {
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

  describe('delete', () => {
    it('should delete a report successfully without deleting the link', async () => {
      // Arrange
      const reportId = '1';
      const mockReport = { id: reportId, link: { id: 'linkId' } };
      mockReportsService.findById.mockResolvedValue(mockReport as any);
      mockReportsService.delete.mockResolvedValue({ success: true } as any);

      // Act
      const result = await reportsController.delete(reportId);

      // Assert
      expect(mockReportsService.findById).toHaveBeenCalledWith(reportId);
      expect(mockReportsService.delete).toHaveBeenCalledWith(reportId);
      expect(result).toEqual({ success: true });
    });

    it('should delete a report and the associated link when deleteLink is true', async () => {
      // Arrange
      const reportId = '1';
      const mockReport = { id: reportId, link: { id: 'linkId', key: 'linkKey' } };
      mockReportsService.findById.mockResolvedValue(mockReport as any);
      mockReportsService.delete.mockResolvedValue({ success: true } as any);
      mockLinksService.delete.mockResolvedValue({ success: true } as any);

      // Act
      const result = await reportsController.delete(reportId, true);

      // Assert
      expect(mockReportsService.findById).toHaveBeenCalledWith(reportId);
      expect(mockCacheService.del).toHaveBeenCalledWith(mockReport.link.key);
      expect(mockLinksService.delete).toHaveBeenCalledWith(mockReport.link.id);
      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException if the report does not exist', async () => {
      // Arrange
      const reportId = '1';
      mockReportsService.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(reportsController.delete(reportId)).rejects.toThrow(NotFoundException);
      expect(mockReportsService.findById).toHaveBeenCalledWith(reportId);
    });

    it('should throw NotFoundException if the report does not exist when deleteLink is true', async () => {
      // Arrange
      const reportId = '1';
      mockReportsService.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(reportsController.delete(reportId, true)).rejects.toThrow(NotFoundException);
      expect(mockReportsService.findById).toHaveBeenCalledWith(reportId);
    });
  });
});

// End of unit tests for: delete
