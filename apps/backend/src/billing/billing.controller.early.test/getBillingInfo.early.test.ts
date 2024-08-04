// Unit tests for: getBillingInfo

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

describe('BillingController.getBillingInfo() getBillingInfo method', () => {
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

  describe('Happy Path', () => {
    it('should return billing info for a valid user', async () => {
      // Arrange
      const mockUser: MockUserContext = { id: '123' };
      const expectedBillingInfo = { plan: 'premium', status: 'active' };
      mockBillingService.getBillingInfo.mockResolvedValue(expectedBillingInfo as any);

      // Act
      const result = await billingController.getBillingInfo(mockUser as any);

      // Assert
      expect(result).toEqual(expectedBillingInfo);
      expect(mockBillingService.getBillingInfo).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors when fetching billing info', async () => {
      // Arrange
      const mockUser: MockUserContext = { id: '123' };
      const errorMessage = 'Database error';
      mockBillingService.getBillingInfo.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(billingController.getBillingInfo(mockUser as any)).rejects.toThrow(InternalServerErrorException);
      expect(mockLoggerService.error).toHaveBeenCalledWith(`Could not fetch billing info for user ${mockUser.id}`, expect.any(Error));
    });

    it('should handle missing user ID gracefully', async () => {
      // Arrange
      const mockUser: MockUserContext = { id: '' }; // Empty ID
      mockBillingService.getBillingInfo.mockResolvedValue(null as any);

      // Act
      const result = await billingController.getBillingInfo(mockUser as any);

      // Assert
      expect(result).toBeNull();
      expect(mockBillingService.getBillingInfo).toHaveBeenCalledWith(mockUser.id);
    });
  });
});

// End of unit tests for: getBillingInfo
