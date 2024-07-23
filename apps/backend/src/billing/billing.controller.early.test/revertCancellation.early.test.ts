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
  getConfig = jest.fn().mockReturnValue({ paddle: { webhookSecret: 'secret' } });
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
    it('should resume subscription successfully', async () => {
      // Arrange
      mockBillingService.resumeSubscription.mockResolvedValueOnce(undefined);

      // Act
      const result = await billingController.revertCancellation(mockUserContext as any);

      // Assert
      expect(result).toEqual({ message: 'Subscription resumed' });
      expect(mockBillingService.resumeSubscription).toHaveBeenCalledWith(mockUserContext.id);
    });
  });

  describe('Edge Cases', () => {
    it('should handle error when resuming subscription fails', async () => {
      // Arrange
      const errorMessage = 'Resume failed';
      mockBillingService.resumeSubscription.mockRejectedValueOnce(new Error(errorMessage));

      // Act & Assert
      await expect(billingController.revertCancellation(mockUserContext as any)).rejects.toThrow(InternalServerErrorException);
      expect(mockAppLoggerService.error).toHaveBeenCalledWith(
        `Could not resume subscription for user ${mockUserContext.id}`,
        expect.any(Error)
      );
    });
  });
});

// End of unit tests for: revertCancellation
