// Unit tests for: verified

import { UnauthorizedException } from '@nestjs/common';

import { Request } from 'express';

import { UserContext } from '../interfaces/user-context';

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
    front: {
      domain: 'http://localhost',
    },
    general: {
      env: 'development',
    },
  });
}

describe('AuthController.verified() verified method', () => {
  let authController: AuthController;
  let mockPrismaService: MockPrismaService;
  let mockAuthService: MockAuthService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    mockAuthService = new MockAuthService();
    authController = new AuthController(
      mockPrismaService as any,
      mockAuthService as any,
      new MockNovuService() as any,
      new MockAppConfigService() as any
    );
  });

  describe('Happy Path', () => {
    it('should return verification status when user is verified', async () => {
      // Arrange
      const mockUserContext: UserContext = { id: '1', email: 'test@example.com' } as any;
      const req = { user: mockUserContext } as unknown as Request;
      const expectedResponse = { verified: true };

      mockAuthService.checkVerification.mockResolvedValue(expectedResponse);

      // Act
      const result = await authController.verified(req as Request);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.checkVerification).toHaveBeenCalledWith(mockUserContext);
    });
  });

  describe('Edge Cases', () => {
    it('should handle case when user is not verified', async () => {
      // Arrange
      const mockUserContext: UserContext = { id: '1', email: 'test@example.com' } as any;
      const req = { user: mockUserContext } as unknown as Request;

      mockAuthService.checkVerification.mockResolvedValue({ verified: false });

      // Act & Assert
      await expect(authController.verified(req as Request)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.checkVerification).toHaveBeenCalledWith(mockUserContext);
    });

    it('should handle errors thrown by checkVerification', async () => {
      // Arrange
      const mockUserContext: UserContext = { id: '1', email: 'test@example.com' } as any;
      const req = { user: mockUserContext } as unknown as Request;

      mockAuthService.checkVerification.mockRejectedValue(new Error('Some error'));

      // Act & Assert
      await expect(authController.verified(req as Request)).rejects.toThrow(Error);
      expect(mockAuthService.checkVerification).toHaveBeenCalledWith(mockUserContext);
    });

    it('should handle case when user is not found', async () => {
      // Arrange
      const mockUserContext: UserContext = { id: '1', email: 'test@example.com' } as any;
      const req = { user: mockUserContext } as unknown as Request;

      mockAuthService.checkVerification.mockResolvedValue(undefined);

      // Act & Assert
      await expect(authController.verified(req as Request)).rejects.toThrow(Error);
      expect(mockAuthService.checkVerification).toHaveBeenCalledWith(mockUserContext);
    });
  });
});

// End of unit tests for: verified
