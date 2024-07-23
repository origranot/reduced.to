// Unit tests for: findAll

import { User } from '@reduced.to/prisma';

import { IPaginationResult, calculateSkip } from '../../../shared/utils';

import { UsersController } from '../users.controller';

class MockFindAllQueryDto {
  public page: number = 1;
  public limit: number = 10;
  public filter: any = {};
  public sort: string = 'createdAt';
}

class MockUsersService {
  public findAll = jest.fn();
}

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({ storage: { enable: true } });
}

class MockStorageService {
  public uploadImage = jest.fn();
}

class MockAppLoggerService {
  public error = jest.fn();
}

class MockAuthService {
  public generateTokens = jest.fn();
}

describe('UsersController.findAll() findAll method', () => {
  let usersController: UsersController;
  let mockUsersService: MockUsersService;
  let mockConfigService: MockAppConfigService;
  let mockStorageService: MockStorageService;
  let mockLoggerService: MockAppLoggerService;
  let mockAuthService: MockAuthService;

  beforeEach(() => {
    mockUsersService = new MockUsersService();
    mockConfigService = new MockAppConfigService();
    mockStorageService = new MockStorageService();
    mockLoggerService = new MockAppLoggerService();
    mockAuthService = new MockAuthService();

    usersController = new UsersController(
      mockUsersService as any,
      mockConfigService as any,
      mockStorageService as any,
      mockLoggerService as any,
      mockAuthService as any
    );
  });

  describe('Happy Path', () => {
    it('should return paginated users when valid query is provided', async () => {
      const query = new MockFindAllQueryDto();
      const expectedResult: IPaginationResult<User> = {
        data: [{ id: 1, name: 'John Doe' }],
        total: 1,
      };

      mockUsersService.findAll.mockResolvedValue(expectedResult as any);

      const result = await usersController.findAll(query);

      expect(result).toEqual(expectedResult);
      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        skip: calculateSkip(query.page, query.limit),
        limit: query.limit,
        filter: query.filter,
        sort: query.sort,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle case when no page is provided', async () => {
      const query = { limit: 10, filter: {}, sort: 'createdAt' } as any;
      const expectedResult: IPaginationResult<User> = {
        data: [{ id: 1, name: 'John Doe' }],
        total: 1,
      };

      mockUsersService.findAll.mockResolvedValue(expectedResult as any);

      const result = await usersController.findAll(query);

      expect(result).toEqual(expectedResult);
      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        limit: query.limit,
        filter: query.filter,
        sort: query.sort,
      });
    });

    it('should handle case when limit is not provided', async () => {
      const query = { page: 1, filter: {}, sort: 'createdAt' } as any;
      const expectedResult: IPaginationResult<User> = {
        data: [{ id: 1, name: 'John Doe' }],
        total: 1,
      };

      mockUsersService.findAll.mockResolvedValue(expectedResult as any);

      const result = await usersController.findAll(query);

      expect(result).toEqual(expectedResult);
      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        skip: calculateSkip(query.page, 10), // default limit
        limit: 10,
        filter: query.filter,
        sort: query.sort,
      });
    });

    it('should handle case when filter is empty', async () => {
      const query = { page: 1, limit: 10, sort: 'createdAt' } as any;
      const expectedResult: IPaginationResult<User> = {
        data: [{ id: 1, name: 'John Doe' }],
        total: 1,
      };

      mockUsersService.findAll.mockResolvedValue(expectedResult as any);

      const result = await usersController.findAll(query);

      expect(result).toEqual(expectedResult);
      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        skip: calculateSkip(query.page, query.limit),
        limit: query.limit,
        filter: undefined,
        sort: query.sort,
      });
    });

    it('should handle case when sort is invalid', async () => {
      const query = { page: 1, limit: 10, filter: {}, sort: 'invalidField' } as any;
      const expectedResult: IPaginationResult<User> = {
        data: [{ id: 1, name: 'John Doe' }],
        total: 1,
      };

      mockUsersService.findAll.mockResolvedValue(expectedResult as any);

      const result = await usersController.findAll(query);

      expect(result).toEqual(expectedResult);
      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        skip: calculateSkip(query.page, query.limit),
        limit: query.limit,
        filter: query.filter,
        sort: query.sort,
      });
    });

    it('should handle case when usersService throws an error', async () => {
      const query = new MockFindAllQueryDto();
      const errorMessage = 'Database error';
      mockUsersService.findAll.mockRejectedValue(new Error(errorMessage));

      await expect(usersController.findAll(query)).rejects.toThrow(errorMessage);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });
});

// End of unit tests for: findAll
