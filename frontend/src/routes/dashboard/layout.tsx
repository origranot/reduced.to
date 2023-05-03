import { component$, Slot } from '@builder.io/qwik';
import { RequestHandler, useLocation } from '@builder.io/qwik-city';
import { ACCESS_COOKIE_NAME, validateAccessToken } from '../../shared/auth.service';
import { DashboardHeader } from '../../components/dashboard/header/header';

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  const acccessToken = cookie.get(ACCESS_COOKIE_NAME)?.value;
  if (!(await validateAccessToken(acccessToken))) {
    throw redirect(302, '/login');
  }
};

export default component$(() => {
  const location = useLocation();
  return (
    <>
      <DashboardHeader links={location.url.pathname.split('/').slice(1, -1)} />
      <Slot />
    </>
  );
});
