import { confettiAnimate } from '../../lib/confetti';
import { Store } from '../../routes';
import { copyToClipboard, normalizeUrl } from '../../utils';

/**
 * Returns the shorter link from the server.
 * @param {string} url - The original url we want to shorten.
 */
const getShortenUrl = async (url: string, ttl: number) => {
  const result = await fetch(`${process.env.CLIENTSIDE_API_DOMAIN}/api/v1/shortener`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, ttl }),
  });

  return result.json();
};

export const handleShortener = async (store: Store) => {
  const originalOfReducedUrl = store.inputValue;
  const urlInput = normalizeUrl(store.inputValue);
  const ttl = store.ttl;

  store.loading = true;

  try {
    const response = await getShortenUrl(urlInput, ttl);

    store.showResult = true;

    const { key } = response;

    if (!key) {
      store.urlError = 'Invalid url...';
      return;
    }

    store.inputValue = '';
    store.originalOfReducedUrl = originalOfReducedUrl;
    store.reducedUrl = window.location.href.split('#')[0] + key;

    copyToClipboard(store.reducedUrl);
    confettiAnimate();
  } catch (error) {
    store.urlError = 'An error occurred while shortening the URL. Please try again.';
    console.error('Error:', error);
  } finally {
    store.inputValue = '';
    store.loading = false;
  }
};
