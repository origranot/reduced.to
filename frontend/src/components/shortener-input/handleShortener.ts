import { confettiAnimate } from '~/lib/confetti';
import { Store } from '~/routes';
import { copyToClipboard, normalizeUrl } from '~/utils';

/**
 * Returns the shorter link from the server.
 * @param {String} originalUrl - The original url we want to shorten.
 */
const getShortenUrl = async (originalUrl: string) => {
  const result = await fetch(`${process.env.API_DOMAIN}/api/v1/shortener`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalUrl }),
  });

  return result.json();
};

export const handleShortener = async (store: Store) => {
  const urlInput = normalizeUrl(store.inputValue);

  store.loading = true;

  const response = await getShortenUrl(urlInput);

  store.loading = false;
  store.showResult = true;

  if (!response.newUrl) {
    store.urlError = 'Invalid url...';
    return;
  }

  const newUrl = response.newUrl;

  store.inputValue = '';
  store.reducedUrl = window.location.href.split('#')[0] + newUrl;

  copyToClipboard(store.reducedUrl);
  confettiAnimate();
};
