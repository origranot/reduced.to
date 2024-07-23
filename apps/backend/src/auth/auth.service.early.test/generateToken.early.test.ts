// Unit tests for: generateToken

import { AuthService } from '../auth.service';

interface MockUserContext {
  id: string;
  email: string;
  name: string;
  role: string;
  plan?: string;
  verified: boolean;
}

class MockPrismaService {
  user = {
    update: jest.fn(),
  };
}

class MockJwtService {
  sign = jest.fn();
}

class MockStorageService {}

class MockAppConfigService {
  getConfig = jest.fn().mockReturnValue({
    auth: {
      jwt: {
        refreshSecret: 'mockRefreshSecret',
      },
    },
  });
}

class MockBillingService {}

describe('AuthService.generateToken() generateToken method', () => {
  let authService: AuthService;
  let mockPrismaService: MockPrismaService;
  let mockJwtService: MockJwtService;
  let mockAppConfigService: MockAppConfigService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    mockJwtService = new MockJwtService();
    mockAppConfigService = new MockAppConfigService();
    authService = new AuthService(
      mockPrismaService as any,
      mockJwtService as any,
      new MockStorageService() as any,
      mockAppConfigService as any,
      new MockBillingService() as any
    );
  });

  describe('Happy Path', () => {
    it('should generate a token with default expiration and secret', () => {
      const user: MockUserContext = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        verified: true,
      };

      const expectedPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: 'FREE',
        verified: user.verified,
        iss: 'reduced.to',
      };

      mockJwtService.sign.mockReturnValue('mockAccessToken');

      const token = authService.generateToken(user as any);

      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload, {});
      expect(token).toBe('mockAccessToken');
    });

    it('should generate a token with custom expiration', () => {
      const user: MockUserContext = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        verified: true,
      };

      const expectedPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: 'FREE',
        verified: user.verified,
        iss: 'reduced.to',
      };

      mockJwtService.sign.mockReturnValue('mockAccessToken');

      const token = authService.generateToken(user as any, '1h');

      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload, { expiresIn: '1h' });
      expect(token).toBe('mockAccessToken');
    });

    it('should generate a token with custom secret', () => {
      const user: MockUserContext = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        verified: true,
      };

      const expectedPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: 'FREE',
        verified: user.verified,
        iss: 'reduced.to',
      };

      mockJwtService.sign.mockReturnValue('mockAccessToken');

      const token = authService.generateToken(user as any, undefined, 'customSecret');

      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload, { secret: 'customSecret' });
      expect(token).toBe('mockAccessToken');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing user context gracefully', () => {
      const user: any = null;

      expect(() => authService.generateToken(user)).toThrow();
    });

    it('should handle empty user context properties', () => {
      const user: MockUserContext = {
        id: '',
        email: '',
        name: '',
        role: '',
        verified: false,
      };

      const expectedPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: 'FREE',
        verified: user.verified,
        iss: 'reduced.to',
      };

      mockJwtService.sign.mockReturnValue('mockAccessToken');

      const token = authService.generateToken(user as any);

      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload, {});
      expect(token).toBe('mockAccessToken');
    });

    it('should handle user context with missing plan', () => {
      const user: MockUserContext = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        verified: true,
      };

      const expectedPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: 'FREE',
        verified: user.verified,
        iss: 'reduced.to',
      };

      mockJwtService.sign.mockReturnValue('mockAccessToken');

      const token = authService.generateToken(user as any);

      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload, {});
      expect(token).toBe('mockAccessToken');
    });
  });
});

// End of unit tests for: generateToken
