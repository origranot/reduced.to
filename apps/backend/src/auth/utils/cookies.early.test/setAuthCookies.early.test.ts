// Unit tests for: setAuthCookies

import { Response } from 'express';

import { calculateDateFromTtl } from '../../../shared/utils';

import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME, setAuthCookies } from '../cookies';

jest.mock('../../../shared/utils', () => ({
  calculateDateFromTtl: jest.fn(),
}));

describe('setAuthCookies() setAuthCookies method', () => {
  let res: Response;
  const mockDomain = 'example.com';
  const mockTokens = {
    accessToken: 'mockAccessToken',
    refreshToken: 'mockRefreshToken',
  };

  beforeEach(() => {
    // Create a mock response object
    res = {
      cookie: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    // Reset the mock for calculateDateFromTtl
    (calculateDateFromTtl as jest.Mock).mockClear();
  });

  describe('Happy Path', () => {
    it('should set auth cookies with correct values and options', () => {
      // Arrange
      const accessTokenExpiry = new Date(Date.now() + 5 * 60 * 1000);
      const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      (calculateDateFromTtl as jest.Mock).mockReturnValueOnce(accessTokenExpiry).mockReturnValueOnce(refreshTokenExpiry);

      // Act
      const result = setAuthCookies(res, mockDomain, mockTokens);

      // Assert
      expect(res.cookie).toHaveBeenCalledWith(AUTH_COOKIE_NAME, mockTokens.accessToken, {
        expires: accessTokenExpiry,
        domain: `.${mockDomain}`,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      });
      expect(res.cookie).toHaveBeenCalledWith(REFRESH_COOKIE_NAME, mockTokens.refreshToken, {
        expires: refreshTokenExpiry,
        domain: `.${mockDomain}`,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      });
      expect(result).toBe(res);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty tokens gracefully', () => {
      // Arrange
      const emptyTokens = {
        accessToken: '',
        refreshToken: '',
      };
      const accessTokenExpiry = new Date(Date.now() + 5 * 60 * 1000);
      const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      (calculateDateFromTtl as jest.Mock).mockReturnValueOnce(accessTokenExpiry).mockReturnValueOnce(refreshTokenExpiry);

      // Act
      const result = setAuthCookies(res, mockDomain, emptyTokens);

      // Assert
      expect(res.cookie).toHaveBeenCalledWith(AUTH_COOKIE_NAME, emptyTokens.accessToken, {
        expires: accessTokenExpiry,
        domain: `.${mockDomain}`,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      });
      expect(res.cookie).toHaveBeenCalledWith(REFRESH_COOKIE_NAME, emptyTokens.refreshToken, {
        expires: refreshTokenExpiry,
        domain: `.${mockDomain}`,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      });
      expect(result).toBe(res);
    });

    it('should handle undefined tokens gracefully', () => {
      // Arrange
      const undefinedTokens = {
        accessToken: undefined,
        refreshToken: undefined,
      };
      const accessTokenExpiry = new Date(Date.now() + 5 * 60 * 1000);
      const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      (calculateDateFromTtl as jest.Mock).mockReturnValueOnce(accessTokenExpiry).mockReturnValueOnce(refreshTokenExpiry);

      // Act
      const result = setAuthCookies(res, mockDomain, undefinedTokens);

      // Assert
      expect(res.cookie).toHaveBeenCalledWith(AUTH_COOKIE_NAME, undefinedTokens.accessToken, {
        expires: accessTokenExpiry,
        domain: `.${mockDomain}`,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      });
      expect(res.cookie).toHaveBeenCalledWith(REFRESH_COOKIE_NAME, undefinedTokens.refreshToken, {
        expires: refreshTokenExpiry,
        domain: `.${mockDomain}`,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      });
      expect(result).toBe(res);
    });

    it('should handle invalid domain gracefully', () => {
      // Arrange
      const invalidDomain = '';
      const accessTokenExpiry = new Date(Date.now() + 5 * 60 * 1000);
      const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      (calculateDateFromTtl as jest.Mock).mockReturnValueOnce(accessTokenExpiry).mockReturnValueOnce(refreshTokenExpiry);

      // Act
      const result = setAuthCookies(res, invalidDomain, mockTokens);

      // Assert
      expect(res.cookie).toHaveBeenCalledWith(AUTH_COOKIE_NAME, mockTokens.accessToken, {
        expires: accessTokenExpiry,
        domain: invalidDomain,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      });
      expect(res.cookie).toHaveBeenCalledWith(REFRESH_COOKIE_NAME, mockTokens.refreshToken, {
        expires: refreshTokenExpiry,
        domain: invalidDomain,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      });
      expect(result).toBe(res);
    });
  });
});

// End of unit tests for: setAuthCookies
