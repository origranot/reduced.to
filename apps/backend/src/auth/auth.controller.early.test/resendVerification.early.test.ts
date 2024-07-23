// Unit tests for: resendVerification

import { Request } from 'express';

import { UserContext } from '../interfaces/user-context';

import { AuthController } from '../auth.controller';

class MockPrismaService {
  public user = {
    findUnique: jest.fn(),
  };
}

class MockAuthService {
  // Define any necessary methods for the AuthService mock
}

class MockNovuService {
  public sendVerificationEmail = jest.fn();
}

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    front: {
      domain: 'http://localhost',
    },
    general: {
      env: 'test',
    },
  });
}

describe('AuthController.resendVerification() resendVerification method', () => {
  let authController: AuthController;
  let mockPrismaService: MockPrismaService;
  let mockAuthService: MockAuthService;
  let mockNovuService: MockNovuService;
  let mockAppConfigService: MockAppConfigService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    mockAuthService = new MockAuthService();
    mockNovuService = new MockNovuService();
    mockAppConfigService = new MockAppConfigService();

    authController = new AuthController(
      mockPrismaService as any,
      mockAuthService as any,
      mockNovuService as any,
      mockAppConfigService as any
    );
  });

  describe('resendVerification', () => {
    it('should send a verification email to the user', async () => {
      // Arrange
      const mockUserContext: UserContext = { id: '123', email: 'test@example.com' } as any;
      const mockUser = { id: '123', email: 'test@example.com' } as any;
      const req = { user: mockUserContext } as unknown as Request;

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser as any);

      // Act
      await authController.resendVerification(req);

      // Assert
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserContext.id },
      });
      expect(mockNovuService.sendVerificationEmail).toHaveBeenCalledWith(mockUser);
    });

    it('should handle case when user is not found', async () => {
      // Arrange
      const mockUserContext: UserContext = { id: '123', email: 'test@example.com' } as any;
      const req = { user: mockUserContext } as unknown as Request;

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(authController.resendVerification(req)).rejects.toThrowError();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserContext.id },
      });
      expect(mockNovuService.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it('should handle errors from sending verification email', async () => {
      // Arrange
      const mockUserContext: UserContext = { id: '123', email: 'test@example.com' } as any;
      const mockUser = { id: '123', email: 'test@example.com' } as any;
      const req = { user: mockUserContext } as unknown as Request;

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser as any);
      mockNovuService.sendVerificationEmail.mockRejectedValue(new Error('Email service error'));

      // Act & Assert
      await expect(authController.resendVerification(req)).rejects.toThrowError('Email service error');
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserContext.id },
      });
    });
  });
});

// End of unit tests for: resendVerification
