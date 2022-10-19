import confetti from 'canvas-confetti';
import { Store } from '../../routes';

function confettiAnimate() {
  confetti({
    particleCount: 120,
    spread: 100,
    origin: {
      x: 0,
      y: 0.8,
    },
  });
  confetti({
    particleCount: 120,
    spread: 100,
    origin: {
      x: 1,
      y: 0.8,
    },
  });
}

export function copyUrl(state: Store) {
  const result = document.querySelector('#result #text');
  navigator.clipboard.writeText(result!.textContent!);

  if (!state.showAlert) {
    state.showAlert = true;
  }
}

/**
 * Returns the shorter link from the server.
 * @param {String} originalUrl - The original url we want to shorten.
 */
const getShortenUrl = async (originalUrl: string) => {
  let result;
  try {
    result = await fetch('/api/v1/shortener', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl }),
    });
  } catch (err) {
    return null;
  }
  return result.json();
};

export function openLink() {
  const text = document.querySelector('#result #text')!.textContent;
  window.open(text!, '_blank');
}

export async function handleShortener({ state }: any) {
  const result = document.getElementById('result');
  const loader = document.getElementById('loading');
  const urlInput = normalizeUrl(state.inputValue);
  loader!.classList.replace('hidden', 'block');
  result!.classList.replace('block', 'hidden');

  const { newUrl } = await getShortenUrl(urlInput);

  // Remove the loader from the screen
  loader!.classList.replace('block', 'hidden');
  result!.classList.replace('hidden', 'block');

  //urlInput.value = "";
  state.inputValue = '';
  if (!newUrl) {
    result!.querySelector('#error')!.textContent = 'This url is invalid..';
    result!.querySelector('#text')!.textContent = '';
    result!.querySelector('#action')!.classList.replace('block', 'hidden');
    return;
  }

  result!.querySelector('#error')!.textContent = '';
  result!.querySelector('#text')!.textContent =
    window.location.href.split('#')[0] + newUrl;
  result!.querySelector('#action')!.classList.replace('hidden', 'block');

  state.showAlert = true;
  copyUrl(state);
  confettiAnimate();
}

/**
 * Normalize input url
 *  - add protocol 'http' if missing.
 *  - correct protocol http/https if mistyped one character.
 * @param {String} url
 * @returns {String}
 */
const normalizeUrl = (url: string): string => {
  const regexBadPrefix = new RegExp(/^(:\/*|\/+|http:\/*)/); // Check if starts with  ':', '/' and 'http:example.com' etc.
  const regexBadPrefixHttps = new RegExp(/^https:\/*/); // Check if 'https:example.com', 'https:/example.com' etc.
  const regexProtocolExists = new RegExp(/^(.+:\/\/|[^a-zA-Z])/); // Check if starts with '*://' or special chars.
  const regexMistypedHttp = new RegExp(
    /^([^hH][tT][tT][pP]|[hH][^tT][tT][pP]|[hH][tT][^tT][pP]|[hH][tT][tT][^pP])/
  );

  url = url.replace(regexMistypedHttp, 'http');
  url = url.replace(regexBadPrefix, 'http://');
  url = url.replace(regexBadPrefixHttps, 'https://');
  url = (regexProtocolExists.test(url) ? '' : 'http://') + url;

  return url;
};
