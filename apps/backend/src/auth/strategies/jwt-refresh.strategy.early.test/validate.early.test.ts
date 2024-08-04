// Unit tests for: validate

import { UnauthorizedException } from '@nestjs/common';

import { Request } from 'express';

import { JwtRefreshStrategy } from '../jwt-refresh.strategy';

class MockAppConfigService {
  public getConfig = jest.fn().mockReturnValue({
    auth: {
      jwt: {
        refreshSecret: 'mockRefreshSecret',
      },
    },
  });
}

class MockAuthService {
  public validateRefreshToken = jest.fn();
}

describe('JwtRefreshStrategy.validate() validate method', () => {
  let jwtRefreshStrategy: JwtRefreshStrategy;
  let mockAppConfigService: MockAppConfigService;
  let mockAuthService: MockAuthService;

  beforeEach(() => {
    mockAppConfigService = new MockAppConfigService();
    mockAuthService = new MockAuthService();
    jwtRefreshStrategy = new JwtRefreshStrategy(mockAppConfigService as any, mockAuthService as any);
  });

  describe('validate', () => {
    it('should return user when valid refresh token is provided', async () => {
      // Arrange
      const request = {
        cookies: {
          refreshToken: 'validRefreshToken',
        },
      } as Request;

      const payload = { id: 'userId' };
      const expectedUser = { id: 'userId', name: 'Test User' };

      mockAuthService.validateRefreshToken.mockResolvedValue(expectedUser as any);

      // Act
      const result = await jwtRefreshStrategy.validate(request, payload);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockAuthService.validateRefreshToken).toHaveBeenCalledWith(payload.id, request.cookies.refreshToken);
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      // Arrange
      const request = {
        cookies: {
          refreshToken: 'invalidRefreshToken',
        },
      } as Request;

      const payload = { id: 'userId' };

      mockAuthService.validateRefreshToken.mockResolvedValue(null as any);

      // Act & Assert
      await expect(jwtRefreshStrategy.validate(request, payload)).rejects.toThrow(UnauthorizedException);
      await expect(jwtRefreshStrategy.validate(request, payload)).rejects.toThrow('Invalid token');
      expect(mockAuthService.validateRefreshToken).toHaveBeenCalledWith(payload.id, request.cookies.refreshToken);
    });

    it('should handle missing refresh token in request', async () => {
      // Arrange
      const request = {
        cookies: {},
      } as Request;

      const payload = { id: 'userId' };

      // Act & Assert
      await expect(jwtRefreshStrategy.validate(request, payload)).rejects.toThrow(UnauthorizedException);
      await expect(jwtRefreshStrategy.validate(request, payload)).rejects.toThrow('Invalid token');
      expect(mockAuthService.validateRefreshToken).not.toHaveBeenCalled();
    });

    it('should handle missing payload id', async () => {
      // Arrange
      const request = {
        cookies: {
          refreshToken: 'validRefreshToken',
        },
      } as Request;

      const payload = {}; // No id

      // Act & Assert
      await expect(jwtRefreshStrategy.validate(request, payload)).rejects.toThrow(UnauthorizedException);
      await expect(jwtRefreshStrategy.validate(request, payload)).rejects.toThrow('Invalid token');
      expect(mockAuthService.validateRefreshToken).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: validate
