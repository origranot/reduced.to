// Unit tests for: findAll

import { IPaginationResult, calculateSkip } from '../../../shared/utils';

import { Link } from '@reduced.to/prisma';

import { Request } from 'express';

import { UserContext } from '../../../auth/interfaces/user-context';

import { LinksController } from '../links.controller';

class MockFindAllQueryDto {
  public page: number = 1;
  public limit: number = 10;
  public filter: string = '';
  public sort: string = 'asc';
}

class MockLinksService {
  public findAll = jest.fn();
}

class MockAppCacheService {
  public del = jest.fn();
}

describe('LinksController.findAll() findAll method', () => {
  let controller: LinksController;
  let mockLinksService: MockLinksService;
  let mockCacheService: MockAppCacheService;
  let mockRequest: Request;

  beforeEach(() => {
    mockLinksService = new MockLinksService();
    mockCacheService = new MockAppCacheService();
    mockRequest = {
      user: { id: 'user-id' } as UserContext,
    } as Request;

    controller = new LinksController(mockLinksService as any, mockCacheService as any);
  });

  describe('findAll', () => {
    it('should return paginated links for a valid request', async () => {
      // Arrange
      const query = new MockFindAllQueryDto();
      const expectedResult: IPaginationResult<Link> = {
        items: [{ id: 'link-id', userId: 'user-id', url: 'http://example.com' }] as any,
        total: 1,
      };
      mockLinksService.findAll.mockResolvedValue(expectedResult as any);

      // Act
      const result = await controller.findAll(mockRequest, query);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockLinksService.findAll).toHaveBeenCalledWith({
        skip: calculateSkip(query.page, query.limit),
        limit: query.limit,
        filter: query.filter,
        sort: query.sort,
        extraWhereClause: { userId: mockRequest.user.id },
      });
    });

    it('should handle case when page is not provided', async () => {
      // Arrange
      const query = { limit: 10, filter: '', sort: 'asc' } as any;
      const expectedResult: IPaginationResult<Link> = {
        items: [{ id: 'link-id', userId: 'user-id', url: 'http://example.com' }] as any,
        total: 1,
      };
      mockLinksService.findAll.mockResolvedValue(expectedResult as any);

      // Act
      const result = await controller.findAll(mockRequest, query);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockLinksService.findAll).toHaveBeenCalledWith({
        limit: query.limit,
        filter: query.filter,
        sort: query.sort,
        extraWhereClause: { userId: mockRequest.user.id },
      });
    });

    it('should handle case when limit is not provided', async () => {
      // Arrange
      const query = { page: 1, filter: '', sort: 'asc' } as any;
      const expectedResult: IPaginationResult<Link> = {
        items: [{ id: 'link-id', userId: 'user-id', url: 'http://example.com' }] as any,
        total: 1,
      };
      mockLinksService.findAll.mockResolvedValue(expectedResult as any);

      // Act
      const result = await controller.findAll(mockRequest, query);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockLinksService.findAll).toHaveBeenCalledWith({
        skip: calculateSkip(query.page, 10), // default limit assumed
        limit: 10,
        filter: query.filter,
        sort: query.sort,
        extraWhereClause: { userId: mockRequest.user.id },
      });
    });

    it('should throw an error if linksService fails', async () => {
      // Arrange
      const query = new MockFindAllQueryDto();
      mockLinksService.findAll.mockRejectedValue(new Error('Service error'));

      // Act & Assert
      await expect(controller.findAll(mockRequest, query)).rejects.toThrow('Service error');
    });

    it('should handle edge case with invalid page number', async () => {
      // Arrange
      const query = { page: -1, limit: 10, filter: '', sort: 'asc' } as any;
      const expectedResult: IPaginationResult<Link> = {
        items: [],
        total: 0,
      };
      mockLinksService.findAll.mockResolvedValue(expectedResult as any);

      // Act
      const result = await controller.findAll(mockRequest, query);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockLinksService.findAll).toHaveBeenCalledWith({
        skip: 0, // calculateSkip should handle negative page
        limit: query.limit,
        filter: query.filter,
        sort: query.sort,
        extraWhereClause: { userId: mockRequest.user.id },
      });
    });
  });
});

// End of unit tests for: findAll
