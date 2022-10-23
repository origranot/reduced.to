import { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ params, response }) => {
  const res = await fetch(`http://localhost:3000/api/v1/shortener/${params.urlId}`);
  const url = await res.text();

  throw response.redirect(url.length ? url : '/unknown');
};
