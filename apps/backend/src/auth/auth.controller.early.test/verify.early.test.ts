// Unit tests for: verify

import { UnauthorizedException } from '@nestjs/common';

import { Request, Response } from 'express';

import { setAuthCookies } from '../utils/cookies';

import { AuthController } from '../auth.controller';

class MockPrismaService {
  public user = {
    findUnique: jest.fn(),
  };
}

class MockAuthService {
  public verify = jest.fn();
  public generateTokens = jest.fn();
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

describe('AuthController.verify() verify method', () => {
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

  describe('verify', () => {
    // it('should return verification data and set cookies when user is verified', async () => {
    //   // Arrange
    //   const req = { user: { email: 'test@example.com' } } as unknown as Request;
    //   const res = { send: jest.fn() } as unknown as Response;
    //   const verificationData = { verified: true };
    //   const user = { email: 'test@example.com' };
    //   const tokens = { accessToken: 'access-token', refreshToken: 'refresh-token' };

    //   mockAuthService.verify.mockResolvedValue(verificationData as any);
    //   mockPrismaService.user.findUnique.mockResolvedValue(user as any);
    //   mockAuthService.generateTokens.mockResolvedValue(tokens as any);
    //   jest.spyOn(setAuthCookies, 'setAuthCookies').mockReturnValue(res);

    //   // Act
    //   await authController.verify(req, res);

    //   // Assert
    //   expect(mockAuthService.verify).toHaveBeenCalledWith(req.user);
    //   expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: req.user.email } });
    //   expect(mockAuthService.generateTokens).toHaveBeenCalledWith(user);
    //   expect(setAuthCookies).toHaveBeenCalledWith(res, mockAppConfigService.getConfig().front.domain, tokens);
    //   expect(res.send).toHaveBeenCalledWith(verificationData);
    // });

    it('should throw UnauthorizedException when user is not verified', async () => {
      // Arrange
      const req = { user: { email: 'test@example.com' } } as unknown as Request;
      const res = {} as Response;
      const verificationData = { verified: false };

      mockAuthService.verify.mockResolvedValue(verificationData as any);

      // Act & Assert
      await expect(authController.verify(req, res)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.verify).toHaveBeenCalledWith(req.user);
    });

    it('should handle errors from the AuthService.verify method', async () => {
      // Arrange
      const req = { user: { email: 'test@example.com' } } as unknown as Request;
      const res = {} as Response;

      mockAuthService.verify.mockRejectedValue(new Error('Verification error'));

      // Act & Assert
      await expect(authController.verify(req, res)).rejects.toThrow(Error);
      expect(mockAuthService.verify).toHaveBeenCalledWith(req.user);
    });

    it('should handle errors from the PrismaService.user.findUnique method', async () => {
      // Arrange
      const req = { user: { email: 'test@example.com' } } as unknown as Request;
      const res = {} as Response;
      const verificationData = { verified: true };

      mockAuthService.verify.mockResolvedValue(verificationData as any);
      mockPrismaService.user.findUnique.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(authController.verify(req, res)).rejects.toThrow(Error);
      expect(mockAuthService.verify).toHaveBeenCalledWith(req.user);
    });
  });
});

// End of unit tests for: verify
