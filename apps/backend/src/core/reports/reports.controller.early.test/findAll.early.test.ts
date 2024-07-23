// Unit tests for: findAll

import { IPaginationResult, calculateSkip } from '../../../shared/utils';

import { Report } from '@reduced.to/prisma';

import { ReportsController } from '../reports.controller';

class MockFindAllQueryDto {
  public page: number | undefined = 1;
  public limit: number | undefined = 10;
  public filter: string | undefined = '';
  public sort: string | undefined = '';
}

class MockReportsService {
  public findAll = jest.fn();
}

class MockLinksService {
  public findBy = jest.fn();
}

class MockAppCacheService {
  public del = jest.fn();
}

describe('ReportsController.findAll() findAll method', () => {
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

  describe('Happy Path', () => {
    it('should return paginated reports when valid query is provided', async () => {
      const query = new MockFindAllQueryDto();
      const mockReports: IPaginationResult<Report> = {
        items: [{ id: '1', linkId: 'link1', category: 'spam', createdAt: new Date() }] as any,
        total: 1,
      };

      mockReportsService.findAll.mockResolvedValue(mockReports as any);

      const result = await reportsController.findAll(query as any);

      expect(result).toEqual(mockReports);
      expect(mockReportsService.findAll).toHaveBeenCalledWith({
        skip: calculateSkip(query.page, query.limit),
        limit: query.limit,
        filter: query.filter,
        sort: query.sort,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle case when page is not provided', async () => {
      const query = new MockFindAllQueryDto();
      query.page = undefined; // Simulating no page provided
      const mockReports: IPaginationResult<Report> = {
        items: [{ id: '1', linkId: 'link1', category: 'spam', createdAt: new Date() }] as any,
        total: 1,
      };

      mockReportsService.findAll.mockResolvedValue(mockReports as any);

      const result = await reportsController.findAll(query as any);

      expect(result).toEqual(mockReports);
      expect(mockReportsService.findAll).toHaveBeenCalledWith({
        limit: query.limit,
        filter: query.filter,
        sort: query.sort,
      });
    });

    it('should handle case when limit is not provided', async () => {
      const query = new MockFindAllQueryDto();
      query.limit = undefined; // Simulating no limit provided
      const mockReports: IPaginationResult<Report> = {
        items: [{ id: '1', linkId: 'link1', category: 'spam', createdAt: new Date() }] as any,
        total: 1,
      };

      mockReportsService.findAll.mockResolvedValue(mockReports as any);

      const result = await reportsController.findAll(query as any);

      expect(result).toEqual(mockReports);
      expect(mockReportsService.findAll).toHaveBeenCalledWith({
        skip: calculateSkip(query.page, 10), // Default limit assumed
        limit: 10,
        filter: query.filter,
        sort: query.sort,
      });
    });

    it('should handle case when filter is an empty string', async () => {
      const query = new MockFindAllQueryDto();
      query.filter = ''; // Simulating empty filter
      const mockReports: IPaginationResult<Report> = {
        items: [{ id: '1', linkId: 'link1', category: 'spam', createdAt: new Date() }] as any,
        total: 1,
      };

      mockReportsService.findAll.mockResolvedValue(mockReports as any);

      const result = await reportsController.findAll(query as any);

      expect(result).toEqual(mockReports);
      expect(mockReportsService.findAll).toHaveBeenCalledWith({
        skip: calculateSkip(query.page, query.limit),
        limit: query.limit,
        filter: query.filter,
        sort: query.sort,
      });
    });

    it('should handle case when sort is not provided', async () => {
      const query = new MockFindAllQueryDto();
      query.sort = undefined; // Simulating no sort provided
      const mockReports: IPaginationResult<Report> = {
        items: [{ id: '1', linkId: 'link1', category: 'spam', createdAt: new Date() }] as any,
        total: 1,
      };

      mockReportsService.findAll.mockResolvedValue(mockReports as any);

      const result = await reportsController.findAll(query as any);

      expect(result).toEqual(mockReports);
      expect(mockReportsService.findAll).toHaveBeenCalledWith({
        skip: calculateSkip(query.page, query.limit),
        limit: query.limit,
        filter: query.filter,
        sort: undefined,
      });
    });
  });
});

// End of unit tests for: findAll
