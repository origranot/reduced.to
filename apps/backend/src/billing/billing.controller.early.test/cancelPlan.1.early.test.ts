// Unit tests for: cancelPlan

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

class MockAuthService {
  generateTokens = jest.fn();
}

describe('BillingController.cancelPlan() cancelPlan method', () => {
  let billingController: BillingController;
  let mockBillingService: MockBillingService;
  let mockConfigService: MockAppConfigService;
  let mockLoggerService: MockAppLoggerService;
  let mockAuthService: MockAuthService;

  beforeEach(() => {
    mockBillingService = new MockBillingService();
    mockConfigService = new MockAppConfigService();
    mockLoggerService = new MockAppLoggerService();
    mockAuthService = new MockAuthService();

    billingController = new BillingController(
      mockBillingService as any,
      mockConfigService as any,
      mockLoggerService as any,
      mockAuthService as any
    );
  });

  describe('cancelPlan', () => {
    let mockUser: MockUserContext;

    beforeEach(() => {
      mockUser = { id: 'user-id-123' };
    });

    it('should cancel the subscription successfully', async () => {
      // This test checks the happy path where the subscription is canceled successfully.
      mockBillingService.cancelSubscription.mockResolvedValue(undefined);

      const result = await billingController.cancelPlan(mockUser as any);

      expect(result).toEqual({ message: 'Subscription cancelled' });
      expect(mockBillingService.cancelSubscription).toHaveBeenCalledWith(mockUser.id);
    });

    it('should log an error and throw an InternalServerErrorException when canceling fails', async () => {
      // This test checks the error handling when canceling the subscription fails.
      const errorMessage = 'Cancellation failed';
      mockBillingService.cancelSubscription.mockRejectedValue(new Error(errorMessage));

      await expect(billingController.cancelPlan(mockUser as any)).rejects.toThrow(InternalServerErrorException);
      expect(mockLoggerService.error).toHaveBeenCalledWith(`Could not cancel subscription for user ${mockUser.id}`, expect.any(Error));
      expect(mockBillingService.cancelSubscription).toHaveBeenCalledWith(mockUser.id);
    });
  });
});

// End of unit tests for: cancelPlan
