'use strict';

/**
 * Returns a random 5 characters url.
 */
const generateShortUrl = () => {
    return Math.random().toString(36).substring(2, 7);
}

/**
 * Check if the short url is not in use.
 * @param {String} shortUrl The shorten url.
 * @returns {Boolean} Is the shortner url taken
 */
const isShortUrlAvailable = (shortUrl) => {
    return (global.URL_DICT[shortUrl] === undefined)
}

/**
 * Return the shortner url of the specific url.
 * @param {String} originalUrl The original url.
 * @returns {String} Returns the key or null
 */
const getShortUrl = (originalUrl) => {
    let urlIndex = Object.values(global.URL_DICT).indexOf(originalUrl);
    return urlIndex !== -1 ? Object.keys(global.URL_DICT)[urlIndex] : null;
}

/**
 * Add the short url to the server routes.
 * @param {String} originalUrl The original url.
 * @param {String} shortUrl The shorten url.
 */
const addUrl = (originalUrl, shortUrl) => {
    global.URL_DICT[shortUrl] = originalUrl;
}

module.exports.generateShortUrl = generateShortUrl;
module.exports.isShortUrlAvailable = isShortUrlAvailable;
module.exports.addUrl = addUrl;
module.exports.getShortUrl = getShortUrl;
