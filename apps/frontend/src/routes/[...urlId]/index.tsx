import { RequestHandler } from '@builder.io/qwik-city';
import { fetchFromServer } from '../../shared/auth.service';

export const onGet: RequestHandler = async ({ params: { urlId }, redirect, request }) => {
  let originalUrl: string;

  try {
    const res = await fetchFromServer(`${process.env.API_DOMAIN}/api/v1/shortener/${urlId}`, request);
    originalUrl = await res.text();

    if (res.status !== 200 || !originalUrl) {
      throw new Error('failed to fetch original url...');
    }
  } catch (err) {
    originalUrl = '/unknown';
  }

  throw redirect(302, originalUrl);
};
