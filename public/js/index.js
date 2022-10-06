'use strict';

/**
 * Handles shortener button click.
 */
const handleShortenerClick = async () => {
<<<<<<< HEAD
  const result = document.getElementById('result');
  const loader = document.getElementById('loading');
  const urlInput = document.getElementById('urlInput');
  const urlAlert = document.getElementById('urlAlert');
=======
	document.getElementById("loading").style.display = "flex"
	const originalUrl = document.getElementById('urlInput').value;
>>>>>>> af5a3945a9ff99b93df32f455c2f62ef6b4435fe

  loader.style.display = 'flex';
  result.style.display = 'none';

  const shortenInfo = await getShortenUrl(urlInput.value);

  // Remove the loader from the screen
  loader.style.display = 'none';
  result.style.display = 'block';

  if (shortenInfo === null) {
    result.textContent = 'This url is invalid..';
    return;
  }

  const { newUrl } = shortenInfo;
  result.textContent = window.location.href + newUrl;
  urlAlert.classList.add('collapse');
};

/**
 * Returns the shorter link from the server.
 * @param {String} originalUrl - The original url we want to shorten.
 */
const getShortenUrl = async (originalUrl) => {
  let result;
  try {
    result = await axios.post('/api/shortener', {
      originalUrl,
    });
  } catch (err) {
    return null;
  }
  return result.data;
};

/**
 * Copy link to clipboard.
 * @param {HTMLElement} htmlElement - HTML Element containing the short url.
 */
const copyUrl = async (htmlElement) => {
  navigator.clipboard.writeText(htmlElement.innerHTML);
  document.getElementById('urlAlert').classList.remove('collapse');
};
