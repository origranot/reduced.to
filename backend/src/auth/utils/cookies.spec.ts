import { Response } from 'express';
import {
  AUTH_COOKIE_EXPIRES,
  AUTH_COOKIE_NAME,
  REFRESH_COOKIE_EXPIRES,
  REFRESH_COOKIE_NAME,
  setAuthCookies,
} from './cookies';

describe('setAuthCookies', () => {
  let res: Response;
  const domain = 'reduced.to';

  beforeEach(() => {
    res = {
      cookie: jest.fn(() => res),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set auth cookies with the correct options', () => {
    const tokens = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };
    const expectedAuthOptions = {
      expires: expect.any(Date),
      domain,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
    };
    const expectedRefreshOptions = {
      expires: expect.any(Date),
      domain,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
    };

    setAuthCookies(res, domain, tokens);

    expect(res.cookie).toHaveBeenCalledTimes(2);
    expect(res.cookie).toHaveBeenCalledWith('accessToken', tokens.accessToken, expectedAuthOptions);
    expect(res.cookie).toHaveBeenCalledWith(
      'refreshToken',
      tokens.refreshToken,
      expectedRefreshOptions
    );
  });

  it('should set auth cookies with the correct expiration time', () => {
    jest.useFakeTimers();
    const tokens = {
      [AUTH_COOKIE_NAME]: 'access_token',
      [REFRESH_COOKIE_NAME]: 'refresh_token',
    };

    const expectedAuthExpires = new Date(Date.now() + AUTH_COOKIE_EXPIRES);
    const expectedRefreshExpires = new Date(Date.now() + REFRESH_COOKIE_EXPIRES);

    const spy = jest.spyOn(res, 'cookie');

    setAuthCookies(res, domain, tokens);

    expect(spy.mock.calls.length).toEqual(2);

    expect((spy.mock.calls[0] as any)[2].expires).toEqual(expectedAuthExpires);
    expect((spy.mock.calls[1] as any)[2].expires).toEqual(expectedRefreshExpires);

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should set auth cookies with the correct domain', () => {
    const tokens = {
      [AUTH_COOKIE_NAME]: 'access_token',
      [REFRESH_COOKIE_NAME]: 'refresh_token',
    };

    const spy = jest.spyOn(res, 'cookie');

    setAuthCookies(res, domain, tokens);

    expect(spy.mock.calls.length).toEqual(2);
    expect((spy.mock.calls[0] as any)[2].domain).toEqual(`${domain}`);
    expect((spy.mock.calls[1] as any)[2].domain).toEqual(`${domain}`);
  });
});
