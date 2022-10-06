'use strict';

/**
 * Handles shortener button click.
 */

let invalidUrl = false;

const handleShortenerClick = async () => {
	const result = document.getElementById("result");
	const loader = document.getElementById("loading");
	const urlInput = document.getElementById("urlInput");
	
	loader.style.display = "block";
	result.style.display = "none";

	invalidUrl = false

	const shortenInfo = await getShortenUrl(urlInput.value);

	// Remove the loader from the screen
	loader.style.display = "none";
	result.style.display = "block";

	if (shortenInfo === null) {
		result.textContent = 'This url is invalid..';
		invalidUrl = true;
		return;
	}

	const { newUrl } = shortenInfo;
	result.querySelector('#text').textContent = window.location.href + newUrl;
	result.querySelector('#action').classList.replace('d-none', 'd-block');

	copyUrl()
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
 */

const copyUrl = () => {
  if (!invalidUrl) {
    return;
  }
  
	const result = document.querySelector("#result #text");
	navigator.clipboard.writeText(result.textContent);
	toastAlert();
};

const toastAlert = (timeoutInMiliseconds = 2000) => {
	const urlAlert = document.getElementById("urlAlert");

	urlAlert.classList.add('fade-in');
	urlAlert.classList.remove('collapse');

	setTimeout(() => {
		urlAlert.classList.remove('fade-in');
		urlAlert.classList.add('fade-out');
		
		setTimeout(() => {
			urlAlert.classList.add('collapse');
			urlAlert.classList.remove('fade-out');
		}, 500);
	}, timeoutInMiliseconds);
}

// Open link in a new window/tab.
const openLink = () => {
	const text = document.querySelector('#result #text').textContent;
	window.open(text, '_blank');
};