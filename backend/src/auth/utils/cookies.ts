import { Response } from 'express';

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
  // get the host from the domain (remove port if present)
  // for example: localhost:5155 -> localhost
  // for example: reduced.to -> reduced.to
  const strippedDomain = rawDomain
    .replace(/http(s)?(:)?(\/\/)?|(\/\/)?(www\.)?/g, '') // strip prefix
    .replace(/:\d+$/g, ''); // strip port
  const domain = process.env.NODE_ENV === 'production' ? `.${strippedDomain}` : strippedDomain;

  res
    .cookie(AUTH_COOKIE_NAME, tokens.accessToken, {
      expires: new Date(new Date().getTime() + AUTH_COOKIE_EXPIRES),
      domain,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
    })
    .cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, {
      expires: new Date(new Date().getTime() + REFRESH_COOKIE_EXPIRES),
      domain,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
    });

  return res;
};
