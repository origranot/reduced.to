// Unit tests for: googleLoginCallback

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

describe('ProvidersController.googleLoginCallback() googleLoginCallback method', () => {
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

  describe('googleLoginCallback', () => {
    it('should throw BadRequestException if req.user is not present', async () => {
      const req = { user: null };
      const res = {} as Response;

      await expect(controller.googleLoginCallback(req as any, res)).rejects.toThrow(BadRequestException);
    });

    it('should sign up a new user if user does not exist', async () => {
      const req = {
        user: {
          email: 'test@example.com',
          fullName: 'Test User',
          providerId: 'providerId',
          picture: 'http://example.com/picture.jpg',
        },
      };
      const res = { redirect: jest.fn() } as unknown as Response;

      mockUsersService.findUserContextByEmail.mockResolvedValue(null);
      mockAuthService.signup.mockResolvedValue({ id: 'userId' });
      mockAuthService.generateTokens.mockResolvedValue({ accessToken: 'token' });

      await controller.googleLoginCallback(req as any, res);

      expect(mockUsersService.findUserContextByEmail).toHaveBeenCalledWith(req.user.email);
      expect(mockAuthService.signup).toHaveBeenCalledWith({
        name: req.user.fullName,
        email: req.user.email,
        password: req.user.providerId,
        profilePicture: req.user.picture,
        provider: ProviderType.GOOGLE,
      });
      expect(mockAuthService.generateTokens).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('http://localhost:4200/dashboard');
    });

    it('should upload user picture if storage is enabled and picture does not exist', async () => {
      const req = {
        user: {
          email: 'test@example.com',
          fullName: 'Test User',
          providerId: 'providerId',
          picture: 'http://example.com/picture.jpg',
        },
      };
      const res = { redirect: jest.fn() } as unknown as Response;

      const user = { id: 'userId' };
      mockUsersService.findUserContextByEmail.mockResolvedValue(user);
      mockAuthService.generateTokens.mockResolvedValue({ accessToken: 'token' });
      mockStorageService.exists.mockReturnValue(false);
      mockStorageService.uploadImageFromUrl.mockResolvedValue(undefined);

      await controller.googleLoginCallback(req as any, res);

      expect(mockStorageService.exists).toHaveBeenCalledWith(`${PROFILE_PICTURE_PREFIX}/${user.id}`);
      expect(mockStorageService.uploadImageFromUrl).toHaveBeenCalledWith(req.user.picture, `${PROFILE_PICTURE_PREFIX}/${user.id}`);
    });

    it('should not upload user picture if it already exists', async () => {
      const req = {
        user: {
          email: 'test@example.com',
          fullName: 'Test User',
          providerId: 'providerId',
          picture: 'http://example.com/picture.jpg',
        },
      };
      const res = { redirect: jest.fn() } as unknown as Response;

      const user = { id: 'userId' };
      mockUsersService.findUserContextByEmail.mockResolvedValue(user);
      mockAuthService.generateTokens.mockResolvedValue({ accessToken: 'token' });
      mockStorageService.exists.mockReturnValue(true);

      await controller.googleLoginCallback(req as any, res);

      expect(mockStorageService.uploadImageFromUrl).not.toHaveBeenCalled();
    });

    it('should redirect to the correct URL based on environment', async () => {
      const req = {
        user: {
          email: 'test@example.com',
          fullName: 'Test User',
          providerId: 'providerId',
          picture: 'http://example.com/picture.jpg',
        },
      };
      const res = { redirect: jest.fn() } as unknown as Response;

      const user = { id: 'userId' };
      mockUsersService.findUserContextByEmail.mockResolvedValue(user);
      mockAuthService.generateTokens.mockResolvedValue({ accessToken: 'token' });

      // Test for production environment
      mockAppConfigService.getConfig.mockReturnValueOnce({
        storage: { enable: true },
        front: { domain: 'example.com' },
        general: { env: 'production' },
      });

      await controller.googleLoginCallback(req as any, res);
      expect(res.redirect).toHaveBeenCalledWith('https://example.com/dashboard');

      // Test for development environment
      mockAppConfigService.getConfig.mockReturnValueOnce({
        storage: { enable: true },
        front: { domain: 'localhost' },
        general: { env: 'development' },
      });

      await controller.googleLoginCallback(req as any, res);
      expect(res.redirect).toHaveBeenCalledWith('http://localhost:4200/dashboard');
    });
  });
});

// End of unit tests for: googleLoginCallback
