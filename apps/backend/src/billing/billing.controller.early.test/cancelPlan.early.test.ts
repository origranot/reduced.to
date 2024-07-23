import { BillingController } from '../billing.controller';
import { InternalServerErrorException } from '@nestjs/common';

interface MockUserContext {
  id: string;
}

class MockBillingService {
  cancelSubscription = jest.fn();
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

class MockAuthService {}

describe('BillingController.cancelPlan() cancelPlan method', () => {
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
    mockUserContext = { id: 'user123' };

    billingController = new BillingController(
      mockBillingService as any,
      mockAppConfigService as any,
      mockAppLoggerService as any,
      mockAuthService as any
    );
  });

  describe('Happy Path', () => {
    it('should cancel the subscription and return a success message', async () => {
      // Arrange
      mockBillingService.cancelSubscription.mockResolvedValue(undefined as never);

      // Act
      const result = await billingController.cancelPlan(mockUserContext as any);

      // Assert
      expect(result).toEqual({ message: 'Subscription cancelled' });
      expect(mockBillingService.cancelSubscription).toHaveBeenCalledWith('user123');
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors thrown by the billing service', async () => {
      // Arrange
      const error = new Error('Service error');
      mockBillingService.cancelSubscription.mockRejectedValue(error as never);

      // Act & Assert
      await expect(billingController.cancelPlan(mockUserContext as any)).rejects.toThrow(InternalServerErrorException);
      expect(mockAppLoggerService.error).toHaveBeenCalledWith('Could not cancel subscription for user user123', error);
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      const error = 'Unexpected error';
      mockBillingService.cancelSubscription.mockRejectedValue(error as never);

      // Act & Assert
      await expect(billingController.cancelPlan(mockUserContext as any)).rejects.toThrow(InternalServerErrorException);
      expect(mockAppLoggerService.error).toHaveBeenCalledWith('Could not cancel subscription for user user123', error);
    });
  });
});
