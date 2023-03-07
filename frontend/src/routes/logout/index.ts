import { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  cookie.delete('accessToken');
  cookie.delete('refreshToken');
  throw redirect(302, '/');
};
