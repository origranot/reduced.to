import { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  cookie.delete('accessToken', { path: '/' });
  cookie.delete('refreshToken', { path: '/' });
  redirect(302, '/');
};
