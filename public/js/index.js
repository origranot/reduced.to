'use strict';

/**
 * Handles shortner button click.
 */
const handleShortnerClick = async () => {
    let originalUrl = document.getElementById('urlInput').value;
    let result = await getShortenUrl(originalUrl);
    alert(result.newUrl);
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