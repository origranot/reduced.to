import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import jwt_decode from 'jwt-decode';
import { ACCESS_COOKIE_NAME, refreshTokens, REFRESH_COOKIE_NAME, setTokensAsCookies } from '../shared/auth.service';
import { Navbar } from '../components/navbar/navbar';
import { VerifyAlert } from '../components/verify-alert/verify-alert';
import { ACCEPT_COOKIES_COOKIE_NAME, UseCookiesAlert } from '../components/use-cookies-alert/use-cookies-alert';
import { Toaster, useToasterProvider } from '../components/toaster/toaster';
import { getProfilePictureUrl } from '../components/navbar/profile/profile';

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
  profilePicture: string;
}

export const useGetCurrentUser = routeLoader$<UserCtx | null>(async ({ cookie }) => {
  const accessCookie = cookie.get(ACCESS_COOKIE_NAME)?.value;
  const refreshCookie = cookie.get(REFRESH_COOKIE_NAME)?.value;

  let data: UserCtx | null = null;
  if (accessCookie) {
    data = jwt_decode(accessCookie);
  } else if (refreshCookie) {
    const { accessToken, refreshToken } = await refreshTokens(refreshCookie);

    setTokensAsCookies(accessToken, refreshToken, cookie);
    data = jwt_decode(accessToken);
  }

  if (data) {
    data.profilePicture = await getProfilePictureUrl(data.id, data.name);
  }

  return data;
});

export const useAcceptCookies = routeLoader$(({ cookie }) => cookie.get(ACCEPT_COOKIES_COOKIE_NAME)?.value);

export default component$(() => {
  const user = useGetCurrentUser();
  const acceptedCookies = useAcceptCookies();

  useToasterProvider();

  return (
    <>
      <Navbar />
      {user.value?.verified === false ? <VerifyAlert /> : ''}
      <main class="flex flex-col h-full pt-[64px]">
        <Slot />
      </main>
      <Toaster />
      <UseCookiesAlert visible={acceptedCookies.value !== 'true'} />
    </>
  );
});
