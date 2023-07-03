import { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ params: { urlId }, redirect, request }) => {
  let originalUrl: string;

  const headers = {
    'x-forwarded-for': request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
  };

  try {
    const res = await fetch(`${process.env.API_DOMAIN}/api/v1/shortener/${urlId}`, {
      headers,
    });
    originalUrl = await res.text();

    if (res.status !== 200 || !originalUrl) {
      throw new Error('failed to fetch original url...');
    }
  } catch (err) {
    originalUrl = '/unknown';
  }

  throw redirect(302, originalUrl);
};
