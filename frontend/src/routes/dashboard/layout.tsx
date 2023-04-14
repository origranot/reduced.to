import { component$, Slot } from '@builder.io/qwik';
import { RequestHandler } from '@builder.io/qwik-city';
import { ACCESS_COOKIE_NAME, validateAccessToken } from '../../shared/auth.service';

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  const acccessToken = cookie.get(ACCESS_COOKIE_NAME)?.value;
  if (!(await validateAccessToken(acccessToken))) {
    throw redirect(302, '/login');
  }
};

export default component$(() => {
  return (
    <>
      <Slot />
    </>
  );
});
