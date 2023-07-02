import { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ params: { urlId }, redirect, clientConn }) => {
  let originalUrl: string;

  console.log("IP", clientConn.ip);

  const headers = {
    ...(clientConn.ip && { 'x-qwik-city-client-conn-ip': clientConn.ip }),
    ...(clientConn.country && { 'x-qwik-city-client-conn-country': clientConn.country }),
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
