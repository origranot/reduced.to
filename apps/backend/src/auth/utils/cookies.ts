import { Response } from 'express';
import { calculateDateFromTtl } from '../../shared/utils';

export const AUTH_COOKIE_EXPIRES = 5 * 60 * 1000; //5 min
export const REFRESH_COOKIE_EXPIRES = 7 * 24 * 60 * 60 * 1000; //7 days

export const AUTH_COOKIE_NAME = 'accessToken';
export const REFRESH_COOKIE_NAME = 'refreshToken';

export const setAuthCookies = (
  res: Response,
  domain: string,
  tokens: {
    accessToken: string;
    refreshToken: string;
  }
) => {
  setCookie(res, domain, AUTH_COOKIE_NAME, tokens.accessToken, {
    expires: calculateDateFromTtl(AUTH_COOKIE_EXPIRES),
  });
  setCookie(res, domain, REFRESH_COOKIE_NAME, tokens.refreshToken, {
    expires: calculateDateFromTtl(REFRESH_COOKIE_EXPIRES),
  });
  return res;
};

export const setCookie = (
  res: Response,
  rawDomain: string,
  key: string,
  value: any,
  opts?: {
    expires?: Date;
  }
) => {
  const domain = process.env.NODE_ENV === 'production' ? `.${rawDomain}` : rawDomain;
  res.cookie(key, value, {
    ...(opts?.expires && { expires: opts.expires }),
    domain,
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
  });
  console.log('Setting cookie', key, value, opts?.expires, domain);
  return res;
};
