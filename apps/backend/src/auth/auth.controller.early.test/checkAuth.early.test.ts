// Unit tests for: checkAuth

import { Request } from 'express';

import { AuthController } from '../auth.controller';

class MockPrismaService {
  public user = {
    findUnique: jest.fn(),
  };
}

class MockAuthService {
  public checkVerification = jest.fn();
}

class MockNovuService {
  public sendVerificationEmail = jest.fn();
}

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    front: { domain: 'http://localhost' },
    general: { env: 'development' },
  });
}

describe('AuthController.checkAuth() checkAuth method', () => {
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

  describe('Happy Path', () => {
    it('should return user context when checkAuth is called with valid JWT', () => {
      // Arrange
      const req = { user: { id: 1, email: 'test@example.com' } } as unknown as Request;

      // Act
      const result = authController.checkAuth(req);

      // Assert
      expect(result).toEqual({ user: req.user });
    });
  });

  describe('Edge Cases', () => {
    // it('should throw an error if user context is not present in the request', () => {
    //   // Arrange
    //   const req = { user: null } as Request;

    //   // Act & Assert
    //   expect(() => authController.checkAuth(req)).toThrowError();
    // });

    // it('should handle unexpected errors gracefully', () => {
    //   // Arrange
    //   const req = { user: { id: 1, email: 'test@example.com' } } as unknown as Request;
    //   jest.spyOn(mockAuthService, 'checkVerification').mockImplementation(() => {
    //     throw new Error('Unexpected error');
    //   });

    //   // Act & Assert
    //   expect(() => authController.checkAuth(req)).toThrowError('Unexpected error');
    // });
  });
});

// End of unit tests for: checkAuth
