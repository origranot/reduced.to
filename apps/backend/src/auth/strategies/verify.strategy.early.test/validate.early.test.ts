// Unit tests for: validate

import { UnauthorizedException } from '@nestjs/common';

import { VerifyStrategy } from '../verify.strategy';

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    auth: {
      jwt: {
        accessSecret: 'mockSecret',
      },
    },
  });
}

describe('VerifyStrategy.validate() validate method', () => {
  let verifyStrategy: VerifyStrategy;
  let mockAppConfigService: MockAppConfigService;

  beforeEach(() => {
    mockAppConfigService = new MockAppConfigService();
    verifyStrategy = new VerifyStrategy(mockAppConfigService as any);
  });

  describe('validate', () => {
    it('should return user data when payload is valid', async () => {
      // This test checks the happy path where the payload is valid.
      const payload = { name: 'John Doe', email: 'john@example.com', plan: 'premium' };
      const result = await verifyStrategy.validate(payload);
      expect(result).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        plan: 'premium',
      });
    });

    it('should throw UnauthorizedException when payload is null', async () => {
      // This test checks the edge case where the payload is null.
      await expect(verifyStrategy.validate(null)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when payload is undefined', async () => {
      // This test checks the edge case where the payload is undefined.
      await expect(verifyStrategy.validate(undefined)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when payload is an empty object', async () => {
      // This test checks the edge case where the payload is an empty object.
      await expect(verifyStrategy.validate({})).rejects.toThrow(UnauthorizedException);
    });

    it('should return user data with missing optional fields', async () => {
      // This test checks the happy path where some optional fields are missing.
      const payload = { name: 'Jane Doe', email: 'jane@example.com' }; // 'plan' is missing
      const result = await verifyStrategy.validate(payload);
      expect(result).toEqual({
        name: 'Jane Doe',
        email: 'jane@example.com',
        plan: undefined, // plan is not provided
      });
    });
  });
});

// End of unit tests for: validate
