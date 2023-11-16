import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import jwt_decode from 'jwt-decode';
import { ACCESS_COOKIE_NAME, refreshTokens, REFRESH_COOKIE_NAME, setTokensAsCookies } from '../shared/auth.service';
import { Navbar } from '../components/navbar/navbar';
import { VerifyAlert } from '../components/verify-alert/verify-alert';
import { ACCEPT_COOKIES_COOKIE_NAME, UseCookiesAlert } from '../components/use-cookies-alert/use-cookies-alert';
import { Footer } from '../components/footer/footer';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export interface UserCtx {
  id: string;
  name: string;
  email: string;
  role: Role;
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

export const useAcceptCookies = routeLoader$(({ cookie }) => cookie.get(ACCEPT_COOKIES_COOKIE_NAME)?.value);

export default component$(() => {
  const user = useGetCurrentUser();
  const acceptedCookies = useAcceptCookies();

  return (
    <>
      <Navbar />
      {user.value?.verified === false ? <VerifyAlert /> : ''}
      <main class="flex flex-col h-full">
        <Slot />
      </main>
      <UseCookiesAlert visible={acceptedCookies.value !== 'true'} />
    </>
  );
});
