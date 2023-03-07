import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import jwt_decode from 'jwt-decode';
import {
  ACCESS_COOKIE_NAME,
  refreshTokens,
  REFRESH_COOKIE_NAME,
  setTokensAsCookies,
} from '../shared/auth.service';
import { Navbar } from '../components/navbar/navbar';
import { VerifyAlert } from '../components/verify-alert/verify-alert';

export interface UserCtx {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  verified: boolean;
}

export const useGetCurrentUser = routeLoader$<UserCtx | null>(async ({ cookie }) => {
  const accessCookie = cookie.get(ACCESS_COOKIE_NAME)?.value;
  const refreshCookie = cookie.get(REFRESH_COOKIE_NAME)?.value;

  if (accessCookie) {
    return jwt_decode(accessCookie);
  } else if (refreshCookie) {
    const { accessToken, refreshToken } = await refreshTokens(refreshCookie);

    setTokensAsCookies(accessToken, refreshToken, cookie);
    return jwt_decode(accessToken);
  }

  return null;
});

export default component$(() => {
  const userCtx = useGetCurrentUser().value;

  return (
    <>
      <Navbar user={userCtx} />
      {userCtx?.verified === false ? <VerifyAlert /> : ''}
      <main>
        <section>
          <Slot />
        </section>
      </main>
    </>
  );
});
