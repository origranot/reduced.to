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

  const mockUserContext: MockUserContext = { id: 'user-id' };

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
    it('should successfully update the plan and return tokens', async () => {
      // Arrange
      const updatePlanDto: UpdatePlanDto = {
        itemId: 'item-id',
        planId: 'plan-id',
        operationType: 'upgrade',
      };
      const updatedUser = { id: 'user-id', name: 'John Doe' };
      const tokens = { accessToken: 'access-token', refreshToken: 'refresh-token' };

      mockBillingService.updateSubscription.mockResolvedValue(updatedUser as any);
      mockAuthService.generateTokens.mockResolvedValue(tokens as any);

      // Act
      const result = await billingController.updatePlan(mockUserContext as any, updatePlanDto);

      // Assert
      expect(result).toEqual({
        message: 'Plan updated',
        ...tokens,
      });
      expect(mockBillingService.updateSubscription).toHaveBeenCalledWith('user-id', 'plan-id', 'item-id', 'upgrade');
      expect(mockAuthService.generateTokens).toHaveBeenCalledWith(updatedUser);
    });

    it('should handle errors when updating the plan', async () => {
      // Arrange
      const updatePlanDto: UpdatePlanDto = {
        itemId: 'item-id',
        planId: 'plan-id',
        operationType: 'downgrade',
      };

      mockBillingService.updateSubscription.mockRejectedValue(new Error('Update failed'));

      // Act & Assert
      await expect(billingController.updatePlan(mockUserContext as any, updatePlanDto)).rejects.toThrow(InternalServerErrorException);
      expect(mockAppLoggerService.error).toHaveBeenCalledWith(
        `Could not update subscription for user ${mockUserContext.id} with planId: ${updatePlanDto.planId}, priceId: ${updatePlanDto.itemId}`,
        expect.any(Error)
      );
    });
  });
});

// End of unit tests for: updatePlan
