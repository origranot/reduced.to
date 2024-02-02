import { ACCESS_COOKIE_NAME } from '../shared/auth.service';

const cache = {
  accessToken: '',
};
export const validateToken = async (accessToken: string): Promise<boolean> => {
  if (accessToken === cache.accessToken) {
    return true;
  }
  try {
    const res = await fetch(`${process.env.API_DOMAIN}/api/v1/auth/check-auth`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        cookie: `${ACCESS_COOKIE_NAME}=${accessToken}`,
      },
    });
    if (res.ok) {
      cache.accessToken = accessToken;
      return true;
    }
  } catch (err) {
    console.error('Failed to validate access token', err);
  }
  return false;
};
