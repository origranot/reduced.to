import { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ response }) => {
  throw response.redirect('/unknown', 308);
};
