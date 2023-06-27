import { RequestHandler } from '@builder.io/qwik-city';
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from '../../shared/auth.service';

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  const domain = process.env.NODE_ENV === 'production' ? `.${process.env.DOMAIN}` : 'localhost';
  cookie.delete(ACCESS_COOKIE_NAME, { path: '/', domain });
  cookie.delete(REFRESH_COOKIE_NAME, { path: '/', domain });
  throw redirect(302, '/');
};
