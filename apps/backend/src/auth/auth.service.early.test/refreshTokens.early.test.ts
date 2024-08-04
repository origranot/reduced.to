// Unit tests for: refreshTokens

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
        refreshSecret: 'refreshSecret',
      },
    },
    front: {
      domain: 'http://localhost',
    },
  });
}

class MockBillingService {}

describe('AuthService.refreshTokens() refreshTokens method', () => {
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

  // Happy Path
  it('should generate new tokens for a valid user context', async () => {
    // Arrange
    const userContext: MockUserContext = {
      id: 'user-id',
      email: 'user@example.com',
      name: 'User',
      role: 'USER',
      verified: true,
    };

    const accessToken = 'newAccessToken';
    const refreshToken = 'newRefreshToken';

    mockJwtService.sign.mockReturnValueOnce(accessToken).mockReturnValueOnce(refreshToken);
    mockPrismaService.user.update.mockResolvedValueOnce({ refreshToken: 'hashedRefreshToken' });

    // Act
    const tokens = await authService.refreshTokens(userContext as any);

    // Assert
    expect(tokens).toEqual({ accessToken, refreshToken });
    expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: userContext.id },
      data: { refreshToken: expect.any(String) },
    });
  });

  // Edge Cases
  it('should handle errors when updating user refresh token', async () => {
    // Arrange
    const userContext: MockUserContext = {
      id: 'user-id',
      email: 'user@example.com',
      name: 'User',
      role: 'USER',
      verified: true,
    };

    const accessToken = 'newAccessToken';
    const refreshToken = 'newRefreshToken';

    mockJwtService.sign.mockReturnValueOnce(accessToken).mockReturnValueOnce(refreshToken);
    mockPrismaService.user.update.mockRejectedValueOnce(new Error('Database error'));

    // Act & Assert
    await expect(authService.refreshTokens(userContext as any)).rejects.toThrow('Database error');
    expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: userContext.id },
      data: { refreshToken: expect.any(String) },
    });
  });

  it('should handle cases where user context is missing required fields', async () => {
    // Arrange
    const userContext: Partial<MockUserContext> = {
      id: 'user-id',
    };

    // Act & Assert
    await expect(authService.refreshTokens(userContext as any)).rejects.toThrow();
  });
});

// End of unit tests for: refreshTokens
