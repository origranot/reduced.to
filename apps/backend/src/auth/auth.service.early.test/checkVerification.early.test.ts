// Unit tests for: checkVerification

import { UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';

interface MockUserContext {
  id: string;
  email: string;
  name: string;
  role: string;
  verified: boolean;
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
  getConfig = jest.fn().mockReturnValue({ auth: { jwt: { refreshSecret: 'secret' } } });
}

class MockBillingService {
  cancelSubscription = jest.fn();
}

describe('AuthService.checkVerification() checkVerification method', () => {
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

  // it('should return verified status when user exists and is verified', async () => {
  //   // Arrange
  //   const mockUser: MockUserContext = { id: '1', email: 'test@example.com', name: 'Test User', role: 'USER', verified: true };
  //   mockPrismaService.user.findUnique.mockResolvedValue(mockUser as any);

  //   // Act
  //   const result = await authService.checkVerification(mockUser);

  //   // Assert
  //   expect(result).toEqual({ verified: true });
  // });

  // it('should return unverified status when user exists and is not verified', async () => {
  //   // Arrange
  //   const mockUser: MockUserContext = { id: '1', email: 'test@example.com', name: 'Test User', role: 'USER', verified: false };
  //   mockPrismaService.user.findUnique.mockResolvedValue(mockUser as any);

  //   // Act
  //   const result = await authService.checkVerification(mockUser);

  //   // Assert
  //   expect(result).toEqual({ verified: false });
  // });

  it('should throw UnauthorizedException when user does not exist', async () => {
    // Arrange
    mockPrismaService.user.findUnique.mockResolvedValue(null);

    // Act & Assert
    await expect(authService.checkVerification({ id: 'non-existent-id' } as any)).rejects.toThrow(UnauthorizedException);
  });

  // it('should throw UnauthorizedException when user exists but has no verification status', async () => {
  //   // Arrange
  //   const mockUser: MockUserContext = { id: '1', email: 'test@example.com', name: 'Test User', role: 'USER', verified: null };
  //   mockPrismaService.user.findUnique.mockResolvedValue(mockUser as any);

  //   // Act & Assert
  //   await expect(authService.checkVerification(mockUser)).rejects.toThrow(UnauthorizedException);
  // });
});

// End of unit tests for: checkVerification
