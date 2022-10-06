"use strict";

/**
 * Handles shortener button click.
 */
const handleShortenerClick = async () => {

  let originalUrl = document.getElementById("urlInput").value;
  let shortenInfo = await getShortenUrl(originalUrl);

  if (shortenInfo === null) {
    document.getElementById("result").textContent = "This url is invalid..";
    return;
  }

  let { newUrl } = shortenInfo;
  document.getElementById("result").textContent = window.location.href + newUrl;
  document.getElementById("urlAlert").classList.add("collapse");
	const result = document.getElementById("result");
	const loader = document.getElementById("loading");
	const urlInput = document.getElementById("urlInput");
	const urlAlert = document.getElementById("urlAlert");
	
	loader.style.display = "block";
	result.style.display = "none";

	const shortenInfo = await getShortenUrl(urlInput.value);

	// Remove the loader from the screen
	loader.style.display = "none";
	result.style.display = "block";

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
    result = await axios.post("/api/shortener", {
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
  document.getElementById("urlAlert").classList.remove("collapse");
	navigator.clipboard.writeText(htmlElement.innerHTML);
	document.getElementById('urlAlert').classList.remove('collapse');

};

