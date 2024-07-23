// Unit tests for: generateTokens

import * as bcrypt from 'bcryptjs';

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
    findUnique: jest.fn(),
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
  });
}

class MockBillingService {
  cancelSubscription = jest.fn();
}

describe('AuthService.generateTokens() generateTokens method', () => {
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

  it('should generate access and refresh tokens successfully', async () => {
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
    mockPrismaService.user.update.mockResolvedValue({ refreshToken: 'hashedRefreshToken' } as any);

    // Act
    const tokens = await authService.generateTokens(user as any);

    // Assert
    expect(tokens).toEqual({ accessToken, refreshToken });
    expect(mockJwtService.sign).toHaveBeenCalledWith(
      expect.objectContaining({ id: user.id, email: user.email, name: user.name, role: user.role, verified: user.verified }),
      expect.any(Object)
    );
    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: { refreshToken: expect.any(String) },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(refreshToken, 10);
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

    const accessToken = 'accessToken';
    const refreshToken = 'refreshToken';

    mockJwtService.sign.mockReturnValueOnce(accessToken).mockReturnValueOnce(refreshToken);
    mockPrismaService.user.update.mockRejectedValue(new Error('Update failed'));

    // Act & Assert
    await expect(authService.generateTokens(user as any)).rejects.toThrow('Update failed');
  });

  it('should generate tokens with default plan if not provided', async () => {
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
    mockPrismaService.user.update.mockResolvedValue({ refreshToken: 'hashedRefreshToken' } as any);

    // Act
    const tokens = await authService.generateTokens(user as any);

    // Assert
    expect(tokens).toEqual({ accessToken, refreshToken });
  });
});

// End of unit tests for: generateTokens
