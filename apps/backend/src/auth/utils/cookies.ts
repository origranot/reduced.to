import { Response } from 'express';
import { calculateDateFromTtl } from '../../shared/utils';

export const AUTH_COOKIE_EXPIRES = 5 * 60 * 1000; //5 min
export const REFRESH_COOKIE_EXPIRES = 7 * 24 * 60 * 60 * 1000; //7 days

export const AUTH_COOKIE_NAME = 'accessToken';
export const REFRESH_COOKIE_NAME = 'refreshToken';

export const setAuthCookies = (
  res: Response,
  rawDomain: string,
  tokens: {
    accessToken: string;
    refreshToken: string;
  }
) => {
  const domain = process.env.NODE_ENV === 'production' ? `.${rawDomain}` : rawDomain;

  res
    .cookie(AUTH_COOKIE_NAME, tokens.accessToken, {
      expires: calculateDateFromTtl(AUTH_COOKIE_EXPIRES),
      domain,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
    })
    .cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, {
      expires: calculateDateFromTtl(REFRESH_COOKIE_EXPIRES),
      domain,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
    });

  return res;
};
