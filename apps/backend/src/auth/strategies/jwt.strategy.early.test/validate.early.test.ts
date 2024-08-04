// Unit tests for: validate

import { UnauthorizedException } from '@nestjs/common';

import { JwtStrategy } from '../jwt.strategy';

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    auth: {
      jwt: {
        accessSecret: 'mockSecret',
      },
    },
  });
}

describe('JwtStrategy.validate() validate method', () => {
  let jwtStrategy: JwtStrategy;
  let mockAppConfigService: MockAppConfigService;

  beforeEach(() => {
    mockAppConfigService = new MockAppConfigService();
    jwtStrategy = new JwtStrategy(mockAppConfigService as any);
  });

  describe('Happy Path', () => {
    it('should return user data when valid payload is provided', async () => {
      // This test checks if the method returns the correct user data when a valid payload is passed.
      const payload = {
        id: '123',
        email: 'test@example.com',
        role: 'user',
        verified: true,
        plan: 'basic',
      };

      const result = await jwtStrategy.validate(payload);
      expect(result).toEqual({
        id: payload.id,
        email: payload.email,
        role: payload.role,
        verified: payload.verified,
        plan: payload.plan,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should throw UnauthorizedException when payload is null', async () => {
      // This test checks if the method throws an UnauthorizedException when the payload is null.
      await expect(jwtStrategy.validate(null)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when payload is undefined', async () => {
      // This test checks if the method throws an UnauthorizedException when the payload is undefined.
      await expect(jwtStrategy.validate(undefined)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when payload is an empty object', async () => {
      // This test checks if the method throws an UnauthorizedException when the payload is an empty object.
      await expect(jwtStrategy.validate({})).rejects.toThrow(UnauthorizedException);
    });

    it('should return user data with missing optional fields', async () => {
      // This test checks if the method can handle a payload with missing optional fields.
      const payload = {
        id: '123',
        email: 'test@example.com',
        // role and verified are missing
      };

      const result = await jwtStrategy.validate(payload);
      expect(result).toEqual({
        id: payload.id,
        email: payload.email,
        role: undefined, // role is missing
        verified: undefined, // verified is missing
        plan: undefined, // plan is missing
      });
    });
  });
});

// End of unit tests for: validate
