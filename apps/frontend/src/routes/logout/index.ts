import { RequestHandler } from '@builder.io/qwik-city';
import { ACCESS_COOKIE_NAME, NEXT_AUTH_CALLBACK_URL_COOKIE, NEXT_AUTH_CSRF_TOKEN_COOKIE, REFRESH_COOKIE_NAME } from '../../shared/auth.service';

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  const domain = process.env.NODE_ENV === 'production' ? `.${process.env.DOMAIN}` : 'localhost';
  if (cookie.has(ACCESS_COOKIE_NAME)) {
    cookie.delete(ACCESS_COOKIE_NAME, { path: '/', domain });
  }
  if (cookie.has(REFRESH_COOKIE_NAME)) {
    cookie.delete(REFRESH_COOKIE_NAME, { path: '/', domain });
  }
  if (cookie.has(NEXT_AUTH_CALLBACK_URL_COOKIE)) {
    cookie.delete(NEXT_AUTH_CALLBACK_URL_COOKIE, { path: '/', domain });
  }
  if (cookie.has(NEXT_AUTH_CSRF_TOKEN_COOKIE)) {
    cookie.delete(NEXT_AUTH_CSRF_TOKEN_COOKIE, { path: '/', domain });
  }
  throw redirect(302, '/');
};
