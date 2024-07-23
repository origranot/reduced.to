// Unit tests for: updatePlan

import { BillingService } from '../billing.service';

import { AppConfigService } from '@reduced.to/config';

import { UpdatePlanDto } from '../dto/update-plan.dto';

import { AppLoggerService } from '@reduced.to/logger';

import { AuthService } from '../../auth/auth.service';

import { BillingController } from '../billing.controller';

import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

interface MockUserContext {
  id: string;
}

class MockBillingService {
  updateSubscription = jest.fn();
}

class MockAppConfigService {
  getConfig = jest.fn().mockReturnValue({
    paddle: {
      webhookSecret: 'mockSecret',
    },
  });
}

class MockAppLoggerService {
  error = jest.fn();
}

class MockAuthService {
  generateTokens = jest.fn();
}

describe('BillingController.updatePlan() updatePlan method', () => {
  let billingController: BillingController;
  let mockBillingService: MockBillingService;
  let mockAppConfigService: MockAppConfigService;
  let mockAppLoggerService: MockAppLoggerService;
  let mockAuthService: MockAuthService;

  beforeEach(async () => {
    mockBillingService = new MockBillingService();
    mockAppConfigService = new MockAppConfigService();
    mockAppLoggerService = new MockAppLoggerService();
    mockAuthService = new MockAuthService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingController],
      providers: [
        {
          provide: BillingService,
          useValue: mockBillingService,
        },
        {
          provide: AppConfigService,
          useValue: mockAppConfigService,
        },
        {
          provide: AppLoggerService,
          useValue: mockAppLoggerService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    billingController = module.get<BillingController>(BillingController);
  });

  describe('updatePlan', () => {
    const userContext: MockUserContext = { id: 'user123' };
    const updatePlanDto: UpdatePlanDto = {
      itemId: 'item123',
      planId: 'plan123',
      operationType: 'upgrade',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully update the plan and return tokens', async () => {
      // Arrange
      const updatedUser = { id: 'user123', name: 'John Doe' };
      mockBillingService.updateSubscription.mockResolvedValue(updatedUser as any);
      mockAuthService.generateTokens.mockResolvedValue({ accessToken: 'token', refreshToken: 'refreshToken' });

      // Act
      const result = await billingController.updatePlan(userContext as any, updatePlanDto);

      // Assert
      expect(result).toEqual({
        message: 'Plan updated',
        accessToken: 'token',
        refreshToken: 'refreshToken',
      });
      expect(mockBillingService.updateSubscription).toHaveBeenCalledWith(
        userContext.id,
        updatePlanDto.planId,
        updatePlanDto.itemId,
        updatePlanDto.operationType
      );
      expect(mockAuthService.generateTokens).toHaveBeenCalledWith(updatedUser);
    });

    it('should handle errors when updating the plan', async () => {
      // Arrange
      mockBillingService.updateSubscription.mockRejectedValue(new Error('Update failed'));

      // Act & Assert
      await expect(billingController.updatePlan(userContext as any, updatePlanDto)).rejects.toThrow(InternalServerErrorException);
      expect(mockAppLoggerService.error).toHaveBeenCalledWith(
        `Could not update subscription for user ${userContext.id} with planId: ${updatePlanDto.planId}, priceId: ${updatePlanDto.itemId}`,
        expect.any(Error)
      );
    });

    it('should handle missing operationType in updatePlanDto', async () => {
      // Arrange
      const invalidUpdatePlanDto = { ...updatePlanDto, operationType: undefined } as any;

      // Act & Assert
      await expect(billingController.updatePlan(userContext as any, invalidUpdatePlanDto)).rejects.toThrow(InternalServerErrorException);
    });

    it('should handle invalid planId in updatePlanDto', async () => {
      // Arrange
      const invalidUpdatePlanDto = { ...updatePlanDto, planId: '' } as any;

      // Act & Assert
      await expect(billingController.updatePlan(userContext as any, invalidUpdatePlanDto)).rejects.toThrow(InternalServerErrorException);
    });
  });
});

// End of unit tests for: updatePlan
