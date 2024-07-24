// Unit tests for: count

import { CountQueryDto } from '../dto';

import { UsersService } from '../users.service';

import { StorageService } from '../../../storage/storage.service';

import { AppLoggerService } from '@reduced.to/logger';

import { AppConfigService } from '@reduced.to/config';

import { AuthService } from '../../../auth/auth.service';

import { UsersController } from '../users.controller';

import { Test, TestingModule } from '@nestjs/testing';

class MockUsersService {
  count = jest.fn();
}

class MockAppConfigService {
  getConfig = jest.fn().mockReturnValue({ storage: { enable: true } });
}

class MockStorageService {
  uploadImage = jest.fn();
}

class MockAppLoggerService {
  error = jest.fn();
}

class MockAuthService {
  generateTokens = jest.fn();
}

describe('UsersController.count() count method', () => {
  let usersController: UsersController;
  let mockUsersService: MockUsersService;
  let mockAppConfigService: MockAppConfigService;
  let mockStorageService: MockStorageService;
  let mockAppLoggerService: MockAppLoggerService;
  let mockAuthService: MockAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useClass: MockUsersService },
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: StorageService, useClass: MockStorageService },
        { provide: AppLoggerService, useClass: MockAppLoggerService },
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    mockUsersService = module.get<MockUsersService>(UsersService);
    mockAppConfigService = module.get<MockAppConfigService>(AppConfigService);
    mockStorageService = module.get<MockStorageService>(StorageService);
    mockAppLoggerService = module.get<MockAppLoggerService>(AppLoggerService);
    mockAuthService = module.get<MockAuthService>(AuthService);
  });

  describe('count', () => {
    it('should return the count of users when valid dates are provided', async () => {
      // Arrange
      const query: CountQueryDto = { startDate: new Date('2023-01-01'), endDate: new Date('2023-12-31'), verified: true };
      mockUsersService.count.mockResolvedValue(5 as any);

      // Act
      const result = await usersController.count(query);

      // Assert
      expect(result).toEqual({ count: 5 });
      expect(mockUsersService.count).toHaveBeenCalledWith({ createdAt: { gte: query.startDate, lte: query.endDate }, verified: true });
    });

    it('should return the count of users when only verified is provided', async () => {
      // Arrange
      const query: CountQueryDto = {
        verified: false,
        startDate: undefined,
        endDate: undefined
      };
      mockUsersService.count.mockResolvedValue(10 as any);

      // Act
      const result = await usersController.count(query);

      // Assert
      expect(result).toEqual({ count: 10 });
      expect(mockUsersService.count).toHaveBeenCalledWith({ verified: false });
    });

    it('should return the count of users when no filters are provided', async () => {
      // Arrange
      const query: CountQueryDto = {
        startDate: undefined,
        endDate: undefined,
        verified: false
      };
      mockUsersService.count.mockResolvedValue(20 as any);

      // Act
      const result = await usersController.count(query);

      // Assert
      expect(result).toEqual({ count: 20 });
      expect(mockUsersService.count).toHaveBeenCalledWith({ verified: false });
    });

    it('should handle the case when startDate is after endDate', async () => {
      // Arrange
      const query: CountQueryDto = {
        startDate: new Date('2023-12-31'), endDate: new Date('2023-01-01'),
        verified: false
      };
      mockUsersService.count.mockResolvedValue(0 as any);

      // Act
      const result = await usersController.count(query);

      // Assert
      expect(result).toEqual({ count: 0 });
      expect(mockUsersService.count).toHaveBeenCalledWith({ createdAt: { gte: query.startDate, lte: query.endDate }, verified: false });
    });

    it('should handle the case when verified is not a boolean', async () => {
      // Arrange
      const query: CountQueryDto = {
        verified: null as any,
        startDate: undefined,
        endDate: undefined
      };
      mockUsersService.count.mockResolvedValue(15 as any);

      // Act
      const result = await usersController.count(query);

      // Assert
      expect(result).toEqual({ count: 15 });
      expect(mockUsersService.count).toHaveBeenCalledWith({});
    });

    it('should handle errors thrown by the usersService.count method', async () => {
      // Arrange
      const query: CountQueryDto = {
        startDate: new Date('2023-01-01'), endDate: new Date('2023-12-31'),
        verified: false
      };
      mockUsersService.count.mockRejectedValue(new Error('Service error'));

      // Act & Assert
      await expect(usersController.count(query)).rejects.toThrow('Service error');
    });
  });
});

// End of unit tests for: count
