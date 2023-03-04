import { component$, Slot } from '@builder.io/qwik';
import { RequestHandler, routeLoader$ } from '@builder.io/qwik-city';
import jwt_decode from 'jwt-decode';
import {
  ACCESS_COOKIE_NAME,
  refreshTokens,
  REFRESH_COOKIE_NAME,
  setTokensAsCookies,
} from '../shared/auth.service';
import { Navbar } from '../components/navbar/navbar';

export interface UserCtx {
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
export const onGet: RequestHandler = async ({ cookie }) => {
  const accessToken = cookie.get(ACCESS_COOKIE_NAME)?.value;
  const refreshToken = cookie.get(REFRESH_COOKIE_NAME)?.value;

  if (!accessToken && refreshToken) {
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshTokens(
      refreshToken
    );

    setTokensAsCookies(newAccessToken, newRefreshToken, cookie);
  }
};

export default component$(() => {
  const userCtx = useGetCurrentUser().value;

  return (
    <>
      <Navbar user={userCtx} />
      <main>
        <section>
          <Slot />
        </section>
      </main>
    </>
  );
});
