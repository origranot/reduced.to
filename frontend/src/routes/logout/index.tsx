import { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ cookie, headers }) => {
  cookie.delete('accessToken');
  cookie.delete('refreshToken');
  headers.set('location', '/');
};
