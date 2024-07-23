import { UpdatePlanDto } from '../dto/update-plan.dto';
import { BillingController } from '../billing.controller';
import { InternalServerErrorException } from '@nestjs/common';

interface MockUserContext {
  id: string;
}

class MockBillingService {
  updateSubscription = jest.fn();
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

class MockAuthService {
  generateTokens = jest.fn();
}

describe('BillingController.updatePlan() updatePlan method', () => {
  let billingController: BillingController;
  let mockBillingService: MockBillingService;
  let mockAppConfigService: MockAppConfigService;
  let mockAppLoggerService: MockAppLoggerService;
  let mockAuthService: MockAuthService;
  let mockUserContext: MockUserContext;

  beforeEach(() => {
    mockBillingService = new MockBillingService();
    mockAppConfigService = new MockAppConfigService();
    mockAppLoggerService = new MockAppLoggerService();
    mockAuthService = new MockAuthService();
    mockUserContext = { id: 'user-id' };

    billingController = new BillingController(
      mockBillingService as any,
      mockAppConfigService as any,
      mockAppLoggerService as any,
      mockAuthService as any
    );
  });

  describe('Happy Path', () => {
    it('should update the plan and return tokens', async () => {
      // Arrange
      const updatePlanDto: UpdatePlanDto = {
        planId: 'plan-id',
        itemId: 'item-id',
        operationType: 'upgrade',
      };
      const updatedUser = { id: 'user-id' };
      const tokens = { accessToken: 'access-token', refreshToken: 'refresh-token' };

      mockBillingService.updateSubscription.mockResolvedValue(updatedUser as any as never);
      mockAuthService.generateTokens.mockResolvedValue(tokens as any as never);

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
  });

  describe('Edge Cases', () => {
    it('should handle errors from billingService.updateSubscription', async () => {
      // Arrange
      const updatePlanDto: UpdatePlanDto = {
        planId: 'plan-id',
        itemId: 'item-id',
        operationType: 'upgrade',
      };
      const error = new Error('Update failed');

      mockBillingService.updateSubscription.mockRejectedValue(error as never);

      // Act & Assert
      await expect(billingController.updatePlan(mockUserContext as any, updatePlanDto)).rejects.toThrow(InternalServerErrorException);
      expect(mockAppLoggerService.error).toHaveBeenCalledWith(
        'Could not update subscription for user user-id with planId: plan-id, priceId: item-id',
        error
      );
    });
  });
});
