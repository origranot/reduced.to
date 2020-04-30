'use strict';

/**
 * Handles shortner button click.
 */
const handleShortnerClick = async () => {
    let originalUrl = document.getElementById('urlInput').value;
    let { newUrl } = await getShortenUrl(originalUrl);
    document.getElementById('result').textContent = window.location.href + newUrl;
}

/**
 * Returns the shorter link from the server.
 * @param {String} originalUrl - The original url we want to shorten.
 */
const getShortenUrl = async (originalUrl) => {
    let result = await axios.post('/api/shortner', {
        originalUrl
    })
    return result.data;
}