import { component$, Slot } from '@builder.io/qwik';
import { RequestHandler, routeLoader$ } from '@builder.io/qwik-city';
import MainLayout from '~/layouts/MainLayout';
import jwt_decode from 'jwt-decode';
import { ACCESS_COOKIE_NAME, refreshTokens, REFRESH_COOKIE_NAME } from '../shared/auth.service';

interface UserCtx {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  validated: boolean;
}

export const useGetCurrentUser = routeLoader$<UserCtx | null>(({ cookie }) => {
  const token = cookie.get(ACCESS_COOKIE_NAME);
  if (!token) return null;

  return jwt_decode(token.value);
});

// Verify that that the access token is valid and if not, refresh it
export const onGet: RequestHandler = async (ev) => {
  const accessToken = ev.cookie.get(ACCESS_COOKIE_NAME)?.value;
  const refreshToken = ev.cookie.get(REFRESH_COOKIE_NAME)?.value;

  ev.headers.set('set-cookie', `test=123; Domain=localhost; Path=/; HttpOnly;`);

  if (refreshToken && !accessToken) {
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshTokens({
      headers: {
        cookie: `${REFRESH_COOKIE_NAME}=${refreshToken}`,
      },
    });

    const domain = process.env.NODE_ENV === 'production' ? `.${process.env.DOMAIN}` : 'localhost';

    if (newAccessToken && newRefreshToken) {
      ev.headers.set(
        'set-cookie',
        `${ACCESS_COOKIE_NAME}=${newAccessToken}; Path=/; Domain=${domain}; HttpOnly; SameSite=Strict; Expires=${new Date(
          new Date().getTime() + 15 * 60 * 1000
        )}`
      );

      ev.headers.set(
        'set-cookie',
        `${REFRESH_COOKIE_NAME}=${newRefreshToken}; Path=/; Domain=${domain}; HttpOnly; SameSite=Strict; Expires=${new Date(
          new Date().getTime() + 7 * 24 * 60 * 60 * 1000
        )})`
      );
    }
  }
};

export default component$(() => {
  return (
    <>
      <MainLayout>
        <Slot />
      </MainLayout>
    </>
  );
});
