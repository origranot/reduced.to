import { RequestHandler } from '@builder.io/qwik-city';
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from '../../shared/auth.service';

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  cookie.delete(ACCESS_COOKIE_NAME, { path: '/' });
  cookie.delete(REFRESH_COOKIE_NAME, { path: '/' });
  throw redirect(302, '/');
};
