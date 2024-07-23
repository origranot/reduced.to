import { BillingService } from '../billing.service';
import { AppConfigService } from '@reduced.to/config';
import { AppLoggerService } from '@reduced.to/logger';
import { AuthService } from '../../auth/auth.service';
import { BillingController } from '../billing.controller';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

interface MockUserContext {
  id: string;
}

class MockBillingService {
  resumeSubscription = jest.fn();
}

class MockAppConfigService {
  getConfig = jest.fn().mockReturnValue({
    paddle: {
      webhookSecret: 'test-secret',
    },
  });
}

class MockAppLoggerService {
  error = jest.fn();
}

class MockAuthService {}

describe('BillingController.revertCancellation() revertCancellation method', () => {
  let billingController: BillingController;
  let mockBillingService: MockBillingService;
  let mockAppConfigService: MockAppConfigService;
  let mockAppLoggerService: MockAppLoggerService;
  let mockAuthService: MockAuthService;
  let mockUserContext: MockUserContext;

  beforeEach(async () => {
    mockBillingService = new MockBillingService();
    mockAppConfigService = new MockAppConfigService();
    mockAppLoggerService = new MockAppLoggerService();
    mockAuthService = new MockAuthService();
    mockUserContext = { id: 'user-id' };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingController],
      providers: [
        { provide: BillingService, useValue: mockBillingService },
        { provide: AppConfigService, useValue: mockAppConfigService },
        { provide: AppLoggerService, useValue: mockAppLoggerService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    billingController = module.get<BillingController>(BillingController);
  });

  describe('Happy Path', () => {
    it('should resume subscription successfully', async () => {
      // Arrange
      mockBillingService.resumeSubscription.mockResolvedValue(undefined as never);

      // Act
      const result = await billingController.revertCancellation(mockUserContext as any);

      // Assert
      expect(result).toEqual({ message: 'Subscription resumed' });
      expect(mockBillingService.resumeSubscription).toHaveBeenCalledWith('user-id');
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors thrown by the billing service', async () => {
      // Arrange
      const error = new Error('Service error');
      mockBillingService.resumeSubscription.mockRejectedValue(error as never);

      // Act & Assert
      await expect(billingController.revertCancellation(mockUserContext as any)).rejects.toThrow(InternalServerErrorException);
      expect(mockAppLoggerService.error).toHaveBeenCalledWith('Could not resume subscription for user user-id', error);
    });
  });
});
