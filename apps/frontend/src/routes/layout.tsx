import { component$, Slot, useComputed$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import jwt_decode from 'jwt-decode';
import { ACCESS_COOKIE_NAME, refreshTokens, REFRESH_COOKIE_NAME, setTokensAsCookies } from '../shared/auth.service';
import { Navbar } from '../components/navbar/navbar';
import { VerifyAlert } from '../components/verify-alert/verify-alert';
import { ACCEPT_COOKIES_COOKIE_NAME, UseCookiesAlert } from '../components/use-cookies-alert/use-cookies-alert';
import { ExtendSesstion, useAuthSession, UserCtx } from './plugin@auth';

export const useGetCurrentUser = routeLoader$<UserCtx | null>(async ({ cookie, sharedMap }) => {
  const originalAuth = {
    accessCookie: cookie.get(ACCESS_COOKIE_NAME)?.value,
    refreshCookie: cookie.get(REFRESH_COOKIE_NAME)?.value,
  };
  const sessionAuth: ExtendSesstion = sharedMap.get("session");

  if (originalAuth.accessCookie) {
    return jwt_decode(originalAuth.accessCookie);
  } else if (originalAuth.refreshCookie) {
    const { accessToken, refreshToken } = await refreshTokens(originalAuth.refreshCookie);
    setTokensAsCookies(accessToken, refreshToken, cookie);
    return jwt_decode(accessToken);
  } else if (sessionAuth && sessionAuth.accessToken) {
    const expires = sessionAuth.expires;
    const expiryDate = new Date(expires);
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
  const userCtx = useGetCurrentUser();
  const user = useAuthSession();
  const acceptedCookies = useAcceptCookies();
  const sessionComputed = useComputed$(() => {
    if (user.value?.user) {
      return {name: user.value?.user?.name};
    } else if (userCtx.value) {
      return {name: userCtx.value?.name};
    } 
    return undefined;
  })

  return (
    <>
      <Navbar session={sessionComputed.value} user={user.value as ExtendSesstion} />
      {userCtx.value?.verified === false ? <VerifyAlert /> : ''}
      <main>
        <section>
          <Slot />
        </section>
      </main>
      <UseCookiesAlert visible={acceptedCookies.value !== 'true'} />
    </>
  );
});

