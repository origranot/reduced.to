import { BillingController } from '../billing.controller';
import { InternalServerErrorException } from '@nestjs/common';

interface MockUserContext {
  id: string;
}

class MockBillingService {
  getBillingInfo = jest.fn();
}

class MockAppConfigService {
  getConfig = jest.fn().mockReturnValue({
    paddle: {
      webhookSecret: 'mockWebhookSecret',
    },
  });
}

class MockAppLoggerService {
  error = jest.fn();
}

class MockAuthService {}

describe('BillingController.getBillingInfo() getBillingInfo method', () => {
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
    mockUserContext = { id: 'mockUserId' };

    billingController = new BillingController(
      mockBillingService as any,
      mockAppConfigService as any,
      mockAppLoggerService as any,
      mockAuthService as any
    );
  });

  describe('Happy Path', () => {
    it('should return billing info for a valid user', async () => {
      // Arrange
      const mockBillingInfo = { info: 'mockBillingInfo' };
      mockBillingService.getBillingInfo.mockResolvedValue(mockBillingInfo as any as never);

      // Act
      const result = await billingController.getBillingInfo(mockUserContext as any);

      // Assert
      expect(result).toEqual(mockBillingInfo);
      expect(mockBillingService.getBillingInfo).toHaveBeenCalledWith('mockUserId');
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors thrown by billingService.getBillingInfo', async () => {
      // Arrange
      const mockError = new Error('mockError');
      mockBillingService.getBillingInfo.mockRejectedValue(mockError as never);

      // Act & Assert
      await expect(billingController.getBillingInfo(mockUserContext as any)).rejects.toThrow(InternalServerErrorException);
      expect(mockAppLoggerService.error).toHaveBeenCalledWith('Could not fetch billing info for user mockUserId', mockError);
    });
  });
});
