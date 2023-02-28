export const ACCESS_COOKIE_NAME = 'accessToken';
export const REFRESH_COOKIE_NAME = 'refreshToken';

export const validateAccessToken = async (token: string | undefined): Promise<boolean> => {
  if (!token) {
    return false;
  }

  const res = await authorizedFetch(`${process.env.API_DOMAIN}/api/v1/auth/check-auth`, {
    headers: {
      Cookie: `${ACCESS_COOKIE_NAME}=${token}`,
    },
  });

  return res.ok;
};

export const authorizedFetch = async (url: string, options = {}) => {
  const response = await fetch(url, { credentials: 'include', ...options });

  if (response.status === 401) {
    try {
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

export const refreshTokens = async (
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
