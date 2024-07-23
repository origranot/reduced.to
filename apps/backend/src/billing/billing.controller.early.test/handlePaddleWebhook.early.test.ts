// Unit tests for: handlePaddleWebhook

import { EventName } from '@paddle/paddle-node-sdk';

import { BillingController } from '../billing.controller';

import { NotFoundException } from '@nestjs/common';

type MockRawBodyRequest = {
  rawBody: Buffer;
};

class MockBillingService {
  verifyWebhookSignature = jest.fn();
  onSubscriptionAcvivated = jest.fn();
  onSubscriptionCancelled = jest.fn();
  onSubscriptionModified = jest.fn();
}

class MockAppConfigService {
  getConfig = jest.fn().mockReturnValue({
    paddle: {
      webhookSecret: 'test_secret',
    },
  });
}

class MockAppLoggerService {
  error = jest.fn();
}

class MockAuthService {}

describe('BillingController.handlePaddleWebhook() handlePaddleWebhook method', () => {
  let controller: BillingController;
  let mockBillingService: MockBillingService;
  let mockConfigService: MockAppConfigService;
  let mockLoggerService: MockAppLoggerService;

  beforeEach(() => {
    mockBillingService = new MockBillingService();
    mockConfigService = new MockAppConfigService();
    mockLoggerService = new MockAppLoggerService();
    const mockAuthService = new MockAuthService();

    controller = new BillingController(
      mockBillingService as any,
      mockConfigService as any,
      mockLoggerService as any,
      mockAuthService as any
    );
  });

  describe('handlePaddleWebhook', () => {
    it('should process SubscriptionActivated event successfully', async () => {
      // Arrange
      const mockSignature = 'valid_signature';
      const mockRequest: MockRawBodyRequest = {
        rawBody: Buffer.from(JSON.stringify({ eventType: EventName.SubscriptionActivated })),
      };
      mockBillingService.verifyWebhookSignature.mockReturnValueOnce({ eventType: EventName.SubscriptionActivated });

      // Act
      await controller.handlePaddleWebhook(mockSignature, mockRequest as any);

      // Assert
      expect(mockBillingService.onSubscriptionAcvivated).toHaveBeenCalled();
    });

    it('should process SubscriptionCanceled event successfully', async () => {
      // Arrange
      const mockSignature = 'valid_signature';
      const mockRequest: MockRawBodyRequest = {
        rawBody: Buffer.from(JSON.stringify({ eventType: EventName.SubscriptionCanceled })),
      };
      mockBillingService.verifyWebhookSignature.mockReturnValueOnce({ eventType: EventName.SubscriptionCanceled });

      // Act
      await controller.handlePaddleWebhook(mockSignature, mockRequest as any);

      // Assert
      expect(mockBillingService.onSubscriptionCancelled).toHaveBeenCalled();
    });

    it('should process SubscriptionUpdated event successfully', async () => {
      // Arrange
      const mockSignature = 'valid_signature';
      const mockRequest: MockRawBodyRequest = {
        rawBody: Buffer.from(JSON.stringify({ eventType: EventName.SubscriptionUpdated })),
      };
      mockBillingService.verifyWebhookSignature.mockReturnValueOnce({ eventType: EventName.SubscriptionUpdated });

      // Act
      await controller.handlePaddleWebhook(mockSignature, mockRequest as any);

      // Assert
      expect(mockBillingService.onSubscriptionModified).toHaveBeenCalled();
    });

    it('should throw NotFoundException if webhookSecret is not set', async () => {
      // Arrange
      const mockSignature = 'valid_signature';
      const mockRequest: MockRawBodyRequest = {
        rawBody: Buffer.from(JSON.stringify({ eventType: EventName.SubscriptionActivated })),
      };
      controller['webhookSecret'] = undefined; // Simulate missing webhook secret

      // Act & Assert
      await expect(controller.handlePaddleWebhook(mockSignature, mockRequest as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if signature verification fails', async () => {
      // Arrange
      const mockSignature = 'invalid_signature';
      const mockRequest: MockRawBodyRequest = {
        rawBody: Buffer.from(JSON.stringify({ eventType: EventName.SubscriptionActivated })),
      };
      mockBillingService.verifyWebhookSignature.mockReturnValueOnce(null); // Simulate verification failure

      // Act & Assert
      await expect(controller.handlePaddleWebhook(mockSignature, mockRequest as any)).rejects.toThrow(NotFoundException);
    });

    it('should not call any billing service method for unknown event types', async () => {
      // Arrange
      const mockSignature = 'valid_signature';
      const mockRequest: MockRawBodyRequest = {
        rawBody: Buffer.from(JSON.stringify({ eventType: 'unknown.event' })),
      };
      mockBillingService.verifyWebhookSignature.mockReturnValueOnce({ eventType: 'unknown.event' });

      // Act
      await controller.handlePaddleWebhook(mockSignature, mockRequest as any);

      // Assert
      expect(mockBillingService.onSubscriptionAcvivated).not.toHaveBeenCalled();
      expect(mockBillingService.onSubscriptionCancelled).not.toHaveBeenCalled();
      expect(mockBillingService.onSubscriptionModified).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: handlePaddleWebhook
