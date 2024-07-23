// Unit tests for: login

import { AuthService } from '../auth.service';

interface MockUserContext {
  id: string;
  email: string;
  name: string;
  role: string;
  plan?: string;
  verified?: boolean;
}

class MockPrismaService {
  user = {
    findUnique: jest.fn(),
    update: jest.fn(),
  };
}

class MockJwtService {
  sign = jest.fn();
}

class MockStorageService {
  delete = jest.fn();
}

class MockAppConfigService {
  getConfig = jest.fn().mockReturnValue({
    auth: {
      jwt: {
        refreshSecret: 'refreshSecret',
      },
    },
    front: {
      domain: 'http://localhost',
    },
    general: {
      env: 'development',
    },
  });
}

class MockBillingService {
  cancelSubscription = jest.fn();
}

describe('AuthService.login() login method', () => {
  let authService: AuthService;
  let mockPrismaService: MockPrismaService;
  let mockJwtService: MockJwtService;
  let mockStorageService: MockStorageService;
  let mockAppConfigService: MockAppConfigService;
  let mockBillingService: MockBillingService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    mockJwtService = new MockJwtService();
    mockStorageService = new MockStorageService();
    mockAppConfigService = new MockAppConfigService();
    mockBillingService = new MockBillingService();

    authService = new AuthService(
      mockPrismaService as any,
      mockJwtService as any,
      mockStorageService as any,
      mockAppConfigService as any,
      mockBillingService as any
    );
  });

  describe('login', () => {
    it('should generate tokens for a valid user', async () => {
      // Arrange
      const user: MockUserContext = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        verified: true,
      };

      const accessToken = 'accessToken';
      const refreshToken = 'refreshToken';

      mockJwtService.sign.mockReturnValueOnce(accessToken).mockReturnValueOnce(refreshToken);
      mockPrismaService.user.update.mockResolvedValueOnce({ refreshToken });

      // Act
      const tokens = await authService.login(user as any);

      // Assert
      expect(tokens).toEqual({ accessToken, refreshToken });
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: { refreshToken: expect.any(String) },
      });
    });

    it('should handle errors when updating user refresh token', async () => {
      // Arrange
      const user: MockUserContext = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        verified: true,
      };

      mockJwtService.sign.mockReturnValueOnce('accessToken').mockReturnValueOnce('refreshToken');
      mockPrismaService.user.update.mockRejectedValueOnce(new Error('Update failed'));

      // Act & Assert
      await expect(authService.login(user as any)).rejects.toThrow('Update failed');
    });

    it('should generate tokens with default plan if not provided', async () => {
      // Arrange
      const user: MockUserContext = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
      };

      const accessToken = 'accessToken';
      const refreshToken = 'refreshToken';

      mockJwtService.sign.mockReturnValueOnce(accessToken).mockReturnValueOnce(refreshToken);
      mockPrismaService.user.update.mockResolvedValueOnce({ refreshToken });

      // Act
      const tokens = await authService.login(user as any);

      // Assert
      expect(tokens).toEqual({ accessToken, refreshToken });
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    });
  });
});

// End of unit tests for: login
