import { Cookie, CookieValue } from '@builder.io/qwik-city';

const authCookieName = 'accessToken';
const refreshCookieName = 'refreshToken';

export const checkAuth = async (token: string): Promise<boolean> => {
  const res = await authorizedFetch(`${process.env.API_DOMAIN}/api/v1/auth/check-auth`, {
    headers: {
      Cookie: `${authCookieName}=${token}`,
    },
  });

  return res.ok;
};

export const isAuthorized = async (cookie: Cookie): Promise<boolean> => {
  const cookieValues: (CookieValue | null)[] = [
    cookie.get(authCookieName),
    cookie.get(refreshCookieName),
  ];

  let cookieAccessToken: string = cookieValues[0] ? cookieValues[0].value : '';
  const cookieRefreshToken: string = cookieValues[1] ? cookieValues[1].value : '';

  if (!cookieAccessToken) {
    if (!cookieRefreshToken) {
      //TODO: Manage clear state here
      return false;
    }

    const { accessToken, refreshToken } = await refreshAccessToken({
      headers: {
        Cookie: `${refreshCookieName}=${cookieRefreshToken}`,
      },
    });

    if (!accessToken || !refreshToken) {
      //TODO: Manage clear state here
      return false;
    }

    const domain = process.env.NODE_ENV === 'production' ? '.reduced.to' : 'localhost';

    cookie.set(authCookieName, accessToken, {
      httpOnly: true,
      domain,
      path: '/',
      sameSite: 'strict',
      expires: new Date(new Date().getTime() + 15 * 60 * 1000),
    });

    cookie.set(refreshCookieName, refreshToken, {
      httpOnly: true,
      domain,
      path: '/',
      sameSite: 'strict',
      expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    });

    cookieAccessToken = accessToken;
  }

  if (!(await checkAuth(cookieAccessToken))) {
    cookie.delete('accessToken');
    cookie.delete('refreshToken');
    return false;
  }

  return true;
};

export const authorizedFetch = async (url: string, options = {}) => {
  const response = await fetch(url, { credentials: 'include', ...options });

  if (response.status === 401) {
    try {
      await refreshAccessToken(options);
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      // Handle error refreshing access token
      console.error('Failed to refresh access token', error);
      throw new Error('Failed to refresh access token');
    }
  }

  return response;
};

export const refreshAccessToken = async (
  options = {}
): Promise<{ accessToken: string; refreshToken: string }> => {
  const res = await fetch(`${process.env.API_DOMAIN}/api/v1/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    ...options,
  });

  if (res.ok) {
    const { accessToken, refreshToken } = await res.json();
    return {
      accessToken,
      refreshToken,
    };
  }

  return {
    accessToken: '',
    refreshToken: '',
  };
};
