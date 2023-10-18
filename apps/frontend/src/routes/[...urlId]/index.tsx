import { RequestHandler } from '@builder.io/qwik-city';

const UNKNOWN_URL = '/unknown';

const isValidUrl = (urlId: string) => {
  return urlId && urlId.split('/')[0] !== UNKNOWN_URL.substring(1) && urlId !== 'null';
};

export const onGet: RequestHandler = async ({ params: { urlId }, redirect, clientConn, request, next }) => {
  let originalUrl = UNKNOWN_URL;

  if (!isValidUrl(urlId)) {
    throw next();
  }

  try {
    const res = await fetch(`${process.env.API_DOMAIN}/api/v1/shortener/${urlId}`, {
      headers: {
        'x-forwarded-for': clientConn.ip || '',
        'user-agent': request.headers.get('user-agent') || '',
      },
    });
    originalUrl = await res.text();

    if (res.status !== 200 || !originalUrl) {
      throw new Error('failed to fetch original url...');
    }
  } catch (err) {
    originalUrl = UNKNOWN_URL;
  }

  throw redirect(302, originalUrl);
};
