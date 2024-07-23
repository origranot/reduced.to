// Unit tests for: getBillingInfo

import { BillingService } from '../billing.service';

import { AppConfigService } from '@reduced.to/config';

import { AppLoggerService } from '@reduced.to/logger';

import { AuthService } from '../../auth/auth.service';

import { BillingController } from '../billing.controller';

import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

// Mock UserContext interface
interface MockUserContext {
  id: string;
}

// Mock BillingService class
class MockBillingService {
  getBillingInfo = jest.fn();
}

// Mock AppConfigService class
class MockAppConfigService {
  getConfig = jest.fn().mockReturnValue({
    paddle: {
      webhookSecret: 'mockSecret',
    },
  });
}

// Mock AppLoggerService class
class MockAppLoggerService {
  error = jest.fn();
}

// Mock AuthService class
class MockAuthService {
  generateTokens = jest.fn();
}

describe('BillingController.getBillingInfo() getBillingInfo method', () => {
  let billingController: BillingController;
  let billingService: MockBillingService;
  let loggerService: MockAppLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingController],
      providers: [
        { provide: BillingService, useClass: MockBillingService },
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: AppLoggerService, useClass: MockAppLoggerService },
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compile();

    billingController = module.get<BillingController>(BillingController);
    billingService = module.get<BillingService>(BillingService) as any;
    loggerService = module.get<AppLoggerService>(AppLoggerService) as any;
  });

  describe('getBillingInfo', () => {
    let mockUser: MockUserContext;

    beforeEach(() => {
      mockUser = { id: '123' };
    });

    it('should return billing info for a valid user', async () => {
      // Arrange
      const expectedBillingInfo = { plan: 'premium', status: 'active' };
      billingService.getBillingInfo.mockResolvedValue(expectedBillingInfo as any);

      // Act
      const result = await billingController.getBillingInfo(mockUser as any);

      // Assert
      expect(result).toEqual(expectedBillingInfo);
      expect(billingService.getBillingInfo).toHaveBeenCalledWith(mockUser.id);
    });

    it('should handle errors and log them', async () => {
      // Arrange
      const errorMessage = 'Database error';
      billingService.getBillingInfo.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(billingController.getBillingInfo(mockUser as any)).rejects.toThrow(InternalServerErrorException);
      expect(loggerService.error).toHaveBeenCalledWith(`Could not fetch billing info for user ${mockUser.id}`, expect.any(Error));
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      billingService.getBillingInfo.mockRejectedValue(null);

      // Act & Assert
      await expect(billingController.getBillingInfo(mockUser as any)).rejects.toThrow(InternalServerErrorException);
      expect(loggerService.error).toHaveBeenCalledWith(`Could not fetch billing info for user ${mockUser.id}`, expect.anything());
    });
  });
});

// End of unit tests for: getBillingInfo
