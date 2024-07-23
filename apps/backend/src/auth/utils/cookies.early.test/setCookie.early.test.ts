// Unit tests for: setCookie

import { Response } from 'express';

import { AUTH_COOKIE_NAME, setCookie } from '../cookies';

jest.mock('express', () => ({
  Response: jest.fn().mockImplementation(() => ({
    cookie: jest.fn(),
  })),
}));

describe('setCookie() setCookie method', () => {
  let res: Response;
  const rawDomain = 'example.com';
  const key = AUTH_COOKIE_NAME;
  const value = 'testValue';
  const opts = { expires: new Date(Date.now() + 1000 * 60 * 5) }; // 5 minutes from now

  beforeEach(() => {
    res = new Response();
  });

  describe('Happy Path', () => {
    it('should set a cookie with the correct parameters in production environment', () => {
      process.env.NODE_ENV = 'production';
      setCookie(res, rawDomain, key, value, opts);

      expect(res.cookie).toHaveBeenCalledWith(key, value, {
        expires: opts.expires,
        domain: '.example.com',
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      });
    });

    it('should set a cookie with the correct parameters in development environment', () => {
      process.env.NODE_ENV = 'development';
      setCookie(res, rawDomain, key, value, opts);

      expect(res.cookie).toHaveBeenCalledWith(key, value, {
        expires: opts.expires,
        domain: rawDomain,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      });
    });

    it('should set a cookie without expiration if opts is not provided', () => {
      process.env.NODE_ENV = 'development';
      setCookie(res, rawDomain, key, value);

      expect(res.cookie).toHaveBeenCalledWith(key, value, {
        domain: rawDomain,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty cookie value', () => {
      process.env.NODE_ENV = 'development';
      setCookie(res, rawDomain, key, '', opts);

      expect(res.cookie).toHaveBeenCalledWith(key, '', {
        expires: opts.expires,
        domain: rawDomain,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      });
    });

    it('should handle undefined cookie value', () => {
      process.env.NODE_ENV = 'development';
      setCookie(res, rawDomain, key, undefined, opts);

      expect(res.cookie).toHaveBeenCalledWith(key, undefined, {
        expires: opts.expires,
        domain: rawDomain,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      });
    });

    it('should handle null cookie value', () => {
      process.env.NODE_ENV = 'development';
      setCookie(res, rawDomain, key, null, opts);

      expect(res.cookie).toHaveBeenCalledWith(key, null, {
        expires: opts.expires,
        domain: rawDomain,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      });
    });

    it('should handle long cookie key and value', () => {
      const longKey = 'a'.repeat(256); // Exceeding typical cookie key length
      const longValue = 'b'.repeat(4096); // Exceeding typical cookie value length
      process.env.NODE_ENV = 'development';
      setCookie(res, rawDomain, longKey, longValue, opts);

      expect(res.cookie).toHaveBeenCalledWith(longKey, longValue, {
        expires: opts.expires,
        domain: rawDomain,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      });
    });
  });
});

// End of unit tests for: setCookie
