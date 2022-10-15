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
  //const urlInput = document.getElementById("urlInput") as HTMLInputElement;
  const urlInput = state.inputValue;
  loader!.classList.replace('hidden', 'block');
  result!.classList.replace('block', 'hidden');

  let validUrl = urlInput;

  if (!RegExp('^https://|^http://').test(urlInput) && urlInput) {
    validUrl = `https://${urlInput}`;
  }
  
  // Remove the loader from the screen
  loader!.classList.replace('block', 'hidden');
  result!.classList.replace('hidden', 'block');

  const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  const regex = new RegExp(expression);
  if (!regex.test(validUrl) && validUrl) {
    result!.querySelector('#error')!.textContent = 'This url is invalid..';
    result!.querySelector('#text')!.textContent = '';
    result!.querySelector('#action')!.classList.replace('block', 'hidden');
    return;
  }

  const { newUrl } = await getShortenUrl(validUrl);

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
