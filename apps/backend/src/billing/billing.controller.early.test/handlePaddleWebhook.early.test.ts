import { EventName, SubscriptionActivatedEvent, SubscriptionCanceledEvent, SubscriptionUpdatedEvent } from '@paddle/paddle-node-sdk';
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
      webhookSecret: 'test-secret',
    },
  });
}

class MockAppLoggerService {
  error = jest.fn();
}

class MockAuthService {}

describe('BillingController.handlePaddleWebhook() handlePaddleWebhook method', () => {
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
    it('should handle SubscriptionActivated event', async () => {
      const mockRequest: MockRawBodyRequest = {
        rawBody: Buffer.from('test-body'),
      };
      const mockSignature = 'test-signature';
      const mockParsedEvent = {
        eventType: EventName.SubscriptionActivated,
      } as SubscriptionActivatedEvent;

      mockBillingService.verifyWebhookSignature.mockReturnValue(mockParsedEvent as any);

      await billingController.handlePaddleWebhook(mockSignature, mockRequest as any);

      expect(mockBillingService.onSubscriptionAcvivated).toHaveBeenCalledWith(mockParsedEvent);
    });

    it('should handle SubscriptionCanceled event', async () => {
      const mockRequest: MockRawBodyRequest = {
        rawBody: Buffer.from('test-body'),
      };
      const mockSignature = 'test-signature';
      const mockParsedEvent = {
        eventType: EventName.SubscriptionCanceled,
      } as SubscriptionCanceledEvent;

      mockBillingService.verifyWebhookSignature.mockReturnValue(mockParsedEvent as any);

      await billingController.handlePaddleWebhook(mockSignature, mockRequest as any);

      expect(mockBillingService.onSubscriptionCancelled).toHaveBeenCalledWith(mockParsedEvent);
    });

    it('should handle SubscriptionUpdated event', async () => {
      const mockRequest: MockRawBodyRequest = {
        rawBody: Buffer.from('test-body'),
      };
      const mockSignature = 'test-signature';
      const mockParsedEvent = {
        eventType: EventName.SubscriptionUpdated,
      } as SubscriptionUpdatedEvent;

      mockBillingService.verifyWebhookSignature.mockReturnValue(mockParsedEvent as any);

      await billingController.handlePaddleWebhook(mockSignature, mockRequest as any);

      expect(mockBillingService.onSubscriptionModified).toHaveBeenCalledWith(mockParsedEvent);
    });
  });

  describe('Edge Cases', () => {
    it('should throw NotFoundException if webhookSecret is not set', async () => {
      billingController['webhookSecret'] = undefined;

      const mockRequest: MockRawBodyRequest = {
        rawBody: Buffer.from('test-body'),
      };
      const mockSignature = 'test-signature';

      await expect(billingController.handlePaddleWebhook(mockSignature, mockRequest as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if verifyWebhookSignature returns null', async () => {
      const mockRequest: MockRawBodyRequest = {
        rawBody: Buffer.from('test-body'),
      };
      const mockSignature = 'test-signature';

      mockBillingService.verifyWebhookSignature.mockReturnValue(null);

      await expect(billingController.handlePaddleWebhook(mockSignature, mockRequest as any)).rejects.toThrow(NotFoundException);
    });

    it('should not call any handler if eventType is unknown', async () => {
      const mockRequest: MockRawBodyRequest = {
        rawBody: Buffer.from('test-body'),
      };
      const mockSignature = 'test-signature';
      const mockParsedEvent = {
        eventType: 'unknown.event',
      };

      mockBillingService.verifyWebhookSignature.mockReturnValue(mockParsedEvent as any);

      await billingController.handlePaddleWebhook(mockSignature, mockRequest as any);

      expect(mockBillingService.onSubscriptionAcvivated).not.toHaveBeenCalled();
      expect(mockBillingService.onSubscriptionCancelled).not.toHaveBeenCalled();
      expect(mockBillingService.onSubscriptionModified).not.toHaveBeenCalled();
    });
  });
});
