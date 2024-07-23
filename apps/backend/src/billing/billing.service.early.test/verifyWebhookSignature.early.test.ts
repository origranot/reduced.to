// Unit tests for: verifyWebhookSignature

import { Environment } from '@paddle/paddle-node-sdk';

import { BillingService } from '../billing.service';

class MockPaddle {
  public webhooks = {
    unmarshal: jest.fn(),
  };
  public subscriptions = {
    cancel: jest.fn(),
    update: jest.fn(),
  };
  constructor() {}
}

class MockPrismaService {
  public user = {
    findUnique: jest.fn(),
  };
  public subscription = {
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn(),
  };
}

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    paddle: { enable: true, secret: 'mock-secret' },
    general: { env: 'development' },
  });
}

class MockAppLoggerService {
  public error = jest.fn();
}

class MockUsageService {
  public updateLimits = jest.fn();
}

describe('BillingService.verifyWebhookSignature() verifyWebhookSignature method', () => {
  let billingService: BillingService;
  let mockPaddle: MockPaddle;
  let mockPrismaService: MockPrismaService;
  let mockAppConfigService: MockAppConfigService;
  let mockAppLoggerService: MockAppLoggerService;
  let mockUsageService: MockUsageService;

  beforeEach(() => {
    mockPaddle = new MockPaddle('mock-secret', { environment: Environment.sandbox }) as any;
    mockPrismaService = new MockPrismaService() as any;
    mockAppConfigService = new MockAppConfigService() as any;
    mockAppLoggerService = new MockAppLoggerService() as any;
    mockUsageService = new MockUsageService() as any;

    billingService = new BillingService(
      mockPrismaService as any,
      mockAppConfigService as any,
      mockAppLoggerService as any,
      mockUsageService as any
    );
    billingService['paddleClient'] = mockPaddle; // Manually set paddleClient for testing
  });

  it('should successfully verify the webhook signature with valid inputs', () => {
    // Arrange
    const signature = 'valid-signature';
    const secret = 'mock-secret';
    const payload = JSON.stringify({ eventType: 'SubscriptionActivated' });

    mockPaddle.webhooks.unmarshal.mockReturnValue({ eventType: 'SubscriptionActivated' });

    // Act
    const result = billingService.verifyWebhookSignature(signature, secret, payload);

    // Assert
    expect(result).toEqual({ eventType: 'SubscriptionActivated' });
    expect(mockPaddle.webhooks.unmarshal).toHaveBeenCalledWith(payload, secret, signature);
  });

  it('should return undefined if paddleClient is not initialized', () => {
    // Arrange
    billingService['paddleClient'] = undefined; // Simulate uninitialized paddleClient
    const signature = 'valid-signature';
    const secret = 'mock-secret';
    const payload = JSON.stringify({ eventType: 'SubscriptionActivated' });

    // Act
    const result = billingService.verifyWebhookSignature(signature, secret, payload);

    // Assert
    expect(result).toBeUndefined();
    expect(mockPaddle.webhooks.unmarshal).not.toHaveBeenCalled();
  });

  it('should handle errors thrown by unmarshal method', () => {
    // Arrange
    const signature = 'valid-signature';
    const secret = 'mock-secret';
    const payload = JSON.stringify({ eventType: 'SubscriptionActivated' });

    mockPaddle.webhooks.unmarshal.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    // Act
    const result = billingService.verifyWebhookSignature(signature, secret, payload);

    // Assert
    expect(result).toBeUndefined();
    expect(mockPaddle.webhooks.unmarshal).toHaveBeenCalledWith(payload, secret, signature);
  });

  it('should handle empty payload gracefully', () => {
    // Arrange
    const signature = 'valid-signature';
    const secret = 'mock-secret';
    const payload = '';

    // Act
    const result = billingService.verifyWebhookSignature(signature, secret, payload);

    // Assert
    expect(result).toBeUndefined();
    expect(mockPaddle.webhooks.unmarshal).not.toHaveBeenCalled();
  });

  it('should handle malformed JSON payload', () => {
    // Arrange
    const signature = 'valid-signature';
    const secret = 'mock-secret';
    const payload = 'invalid-json';

    // Act
    const result = billingService.verifyWebhookSignature(signature, secret, payload);

    // Assert
    expect(result).toBeUndefined();
    expect(mockPaddle.webhooks.unmarshal).not.toHaveBeenCalled();
  });
});

// End of unit tests for: verifyWebhookSignature
