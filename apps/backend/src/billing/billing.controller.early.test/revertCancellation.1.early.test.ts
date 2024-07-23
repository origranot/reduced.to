// Unit tests for: revertCancellation

import { BillingController } from '../billing.controller';

import { InternalServerErrorException } from '@nestjs/common';

interface MockUserContext {
  id: string;
}

class MockBillingService {
  resumeSubscription = jest.fn();
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

describe('BillingController.revertCancellation() revertCancellation method', () => {
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

  describe('revertCancellation', () => {
    const mockUser: MockUserContext = { id: 'user123' };

    it('should resume subscription successfully', async () => {
      // This test checks the happy path where the subscription is resumed without errors.
      mockBillingService.resumeSubscription.mockResolvedValueOnce(undefined);

      const result = await billingController.revertCancellation(mockUser as any);

      expect(result).toEqual({ message: 'Subscription resumed' });
      expect(mockBillingService.resumeSubscription).toHaveBeenCalledWith(mockUser.id);
    });

    it('should handle errors when resuming subscription', async () => {
      // This test checks the error handling when an error occurs during subscription resumption.
      const errorMessage = 'Error resuming subscription';
      mockBillingService.resumeSubscription.mockRejectedValueOnce(new Error(errorMessage));

      await expect(billingController.revertCancellation(mockUser as any)).rejects.toThrow(InternalServerErrorException);
      expect(mockLoggerService.error).toHaveBeenCalledWith(`Could not resume subscription for user ${mockUser.id}`, expect.any(Error));
    });
  });
});

// End of unit tests for: revertCancellation
