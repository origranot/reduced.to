// Unit tests for: googleLogin

import { BadRequestException } from '@nestjs/common';

import { Response } from 'express';

import { ProviderType } from '@reduced.to/prisma';

import { PROFILE_PICTURE_PREFIX } from '../../../storage/storage.service';

import { ProvidersController } from '../providers.controller';

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    storage: { enable: true },
    front: { domain: 'localhost' },
    general: { env: 'development' },
  });
}

class MockAuthService {
  public signup = jest.fn();
  public generateTokens = jest.fn();
}

class MockUsersService {
  public findUserContextByEmail = jest.fn();
}

class MockStorageService {
  public exists = jest.fn();
  public uploadImageFromUrl = jest.fn();
}

describe('ProvidersController.googleLogin() googleLogin method', () => {
  let controller: ProvidersController;
  let mockAppConfigService: MockAppConfigService;
  let mockAuthService: MockAuthService;
  let mockUsersService: MockUsersService;
  let mockStorageService: MockStorageService;

  beforeEach(() => {
    mockAppConfigService = new MockAppConfigService();
    mockAuthService = new MockAuthService();
    mockUsersService = new MockUsersService();
    mockStorageService = new MockStorageService();

    controller = new ProvidersController(
      mockAppConfigService as any,
      mockAuthService as any,
      mockUsersService as any,
      mockStorageService as any
    );
  });

  describe('googleLogin', () => {
    it('should call googleLogin and not throw an error', async () => {
      // This test checks that the method can be called without throwing an error.
      await expect(controller.googleLogin()).resolves.not.toThrow();
    });

    it('should handle user signup when user does not exist', async () => {
      // Arrange
      const req = { user: { email: 'test@example.com', fullName: 'Test User', providerId: '123', picture: 'http://example.com/pic.jpg' } };
      const res = { redirect: jest.fn() } as unknown as Response;

      mockUsersService.findUserContextByEmail.mockResolvedValue(null);
      mockAuthService.signup.mockResolvedValue({ id: 'user-id' });
      mockAuthService.generateTokens.mockResolvedValue({ accessToken: 'token' });
      mockStorageService.exists.mockReturnValue(false);

      // Act
      await controller.googleLoginCallback(req as any, res);

      // Assert
      expect(mockAuthService.signup).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
        profilePicture: 'http://example.com/pic.jpg',
        provider: ProviderType.GOOGLE,
      });
      expect(mockStorageService.uploadImageFromUrl).toHaveBeenCalledWith('http://example.com/pic.jpg', `${PROFILE_PICTURE_PREFIX}/user-id`);
      expect(res.redirect).toHaveBeenCalledWith('http://localhost:4200/dashboard');
    });

    it('should handle existing user and not call signup', async () => {
      // Arrange
      const req = { user: { email: 'test@example.com', fullName: 'Test User', providerId: '123', picture: 'http://example.com/pic.jpg' } };
      const res = { redirect: jest.fn() } as unknown as Response;

      const existingUser = { id: 'existing-user-id' };
      mockUsersService.findUserContextByEmail.mockResolvedValue(existingUser);
      mockAuthService.generateTokens.mockResolvedValue({ accessToken: 'token' });
      mockStorageService.exists.mockReturnValue(false);

      // Act
      await controller.googleLoginCallback(req as any, res);

      // Assert
      expect(mockAuthService.signup).not.toHaveBeenCalled();
      expect(mockStorageService.uploadImageFromUrl).toHaveBeenCalledWith(
        'http://example.com/pic.jpg',
        `${PROFILE_PICTURE_PREFIX}/existing-user-id`
      );
      expect(res.redirect).toHaveBeenCalledWith('http://localhost:4200/dashboard');
    });

    it('should throw BadRequestException if user is not in request', async () => {
      // Arrange
      const req = { user: null };
      const res = {} as Response;

      // Act & Assert
      await expect(controller.googleLoginCallback(req as any, res)).rejects.toThrow(BadRequestException);
    });

    it('should handle storage service existing image check', async () => {
      // Arrange
      const req = { user: { email: 'test@example.com', fullName: 'Test User', providerId: '123', picture: 'http://example.com/pic.jpg' } };
      const res = { redirect: jest.fn() } as unknown as Response;

      const existingUser = { id: 'existing-user-id' };
      mockUsersService.findUserContextByEmail.mockResolvedValue(existingUser);
      mockAuthService.generateTokens.mockResolvedValue({ accessToken: 'token' });
      mockStorageService.exists.mockReturnValue(true);

      // Act
      await controller.googleLoginCallback(req as any, res);

      // Assert
      expect(mockStorageService.uploadImageFromUrl).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('http://localhost:4200/dashboard');
    });
  });
});

// End of unit tests for: googleLogin
