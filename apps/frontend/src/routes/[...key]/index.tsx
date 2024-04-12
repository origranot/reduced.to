import { RequestHandler } from '@builder.io/qwik-city';

const UNKNOWN_URL = '/unknown';

const isValidKey = (key: string) => {
  return key && key.split('/')[0] !== UNKNOWN_URL.substring(1) && key !== 'null';
};

export const onGet: RequestHandler = async ({ params: { key }, query, redirect, clientConn, request, next }) => {
  let redirectTo: string | null = null; // Variable to store the redirect target

  if (!isValidKey(key)) {
    throw next();
  }

  try {
    const res = await fetch(`${process.env.API_DOMAIN}/api/v1/shortener/${key}?pw=${query.get('pw')}`, {
      headers: {
        'x-forwarded-for': clientConn.ip || '',
        'user-agent': request.headers.get('user-agent') || '',
      },
    });

    const data = await res.json();

    if (res.status === 401) {
      // If unauthorized, set the redirect target to the password page
      redirectTo = `/password/${key}`;
    } else if (res.status === 200 && data.url) {
      redirectTo = data.url;
    } else if (res.status === 404) {
      throw new Error('Shortened URL is wrong or expired');
    } else {
      throw new Error('Failed to fetch original URL');
    }
  } catch (err) {
    console.error(err);
  }

  // Throw the redirect after the try-catch block
  throw redirect(302, redirectTo || UNKNOWN_URL);
};
