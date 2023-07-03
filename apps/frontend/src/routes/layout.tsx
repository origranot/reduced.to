import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import jwt_decode from 'jwt-decode';
import { ACCESS_COOKIE_NAME, refreshTokens, REFRESH_COOKIE_NAME, setTokensAsCookies } from '../shared/auth.service';
import { Navbar } from '../components/navbar/navbar';
import { VerifyAlert } from '../components/verify-alert/verify-alert';
import {
  ACCEPT_COOKIES_COOKIE_NAME,
  UseCookiesAlert,
} from '../components/use-cookies-alert/use-cookies-alert';
import { useAuthSession } from './plugin@auth';


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

export const useGetCurrentUser = routeLoader$<UserCtx | null>(async ({ cookie, sharedMap }) => {
  const accessCookie = cookie.get(ACCESS_COOKIE_NAME)?.value;
  const refreshCookie = cookie.get(REFRESH_COOKIE_NAME)?.value;
  // Provider only will get session from sharedMap.
  const sessionAuth = sharedMap.get("session")

  if (accessCookie) {
    return jwt_decode(accessCookie);
  } else if (refreshCookie) {
    const { accessToken, refreshToken } = await refreshTokens(refreshCookie);
    setTokensAsCookies(accessToken, refreshToken, cookie);
    return jwt_decode(accessToken);
  } else if (sessionAuth.accessToken) {
    // Check if the session is expired or not
    // If expired, refresh the token and return the new access token
    // If not expired, return the access token
    const expires = sessionAuth.expires;
    const expiryDate = new Date(expires); // Convert string to Date object
    const currentDate = new Date();
    if (currentDate > expiryDate) {
      const { accessToken, refreshToken } = await refreshTokens(sessionAuth.refreshToken);
      setTokensAsCookies(accessToken, refreshToken, cookie);
      return jwt_decode(accessToken);
    } else {
      return jwt_decode(sessionAuth.accessToken);
    }
  }

  return null;
});

export const useAcceptCookies = routeLoader$(({ cookie }) => cookie.get(ACCEPT_COOKIES_COOKIE_NAME)?.value);

export default component$(() => {
  const userCtx = useGetCurrentUser().value;
  const acceptedCookies = useAcceptCookies().value === 'true';
  const user = useAuthSession()
  return (
    <>
      <Navbar session={user.value} />
      {userCtx?.verified === false ? <VerifyAlert /> : ''}
      {/* TODO: NOW I FOCUS ON GETTING THE VERIFIED */}
      <main>
        <section>
          <Slot />
        </section>
      </main>
      <UseCookiesAlert visible={acceptedCookies} />
    </>
  );
});
