// Unit tests for: validateRefreshToken

import * as bcrypt from 'bcryptjs';

import { AuthService } from '../auth.service';

class MockPrismaService {
  user = {
    findUnique: jest.fn(),
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
        refreshSecret: 'someSecret',
      },
    },
  });
}

class MockBillingService {}

describe('AuthService.validateRefreshToken() validateRefreshToken method', () => {
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

  it('should return user when refresh token is valid', async () => {
    // Arrange
    const userId = 'user-id';
    const refreshToken = 'valid-refresh-token';
    const user = {
      id: userId,
      refreshToken: await bcrypt.hash(refreshToken, 10), // Hash the refresh token
    };

    mockPrismaService.user.findUnique.mockResolvedValue(user as any);

    // Act
    const result = await authService.validateRefreshToken(userId, refreshToken);

    // Assert
    expect(result).toEqual(user);
  });

  it('should return null when user does not exist', async () => {
    // Arrange
    const userId = 'non-existent-user-id';
    const refreshToken = 'some-refresh-token';

    mockPrismaService.user.findUnique.mockResolvedValue(null);

    // Act
    const result = await authService.validateRefreshToken(userId, refreshToken);

    // Assert
    expect(result).toBeNull();
  });

  it('should return null when refresh token is invalid', async () => {
    // Arrange
    const userId = 'user-id';
    const refreshToken = 'invalid-refresh-token';
    const user = {
      id: userId,
      refreshToken: await bcrypt.hash('some-other-token', 10), // Hash a different token
    };

    mockPrismaService.user.findUnique.mockResolvedValue(user as any);

    // Act
    const result = await authService.validateRefreshToken(userId, refreshToken);

    // Assert
    expect(result).toBeNull();
  });

  it('should return false when refresh token is not provided', async () => {
    // Arrange
    const userId = 'user-id';
    const refreshToken = '';

    // Act
    const result = await authService.validateRefreshToken(userId, refreshToken);

    // Assert
    expect(result).toBe(false);
  });
});

// End of unit tests for: validateRefreshToken
