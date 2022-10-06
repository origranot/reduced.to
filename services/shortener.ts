/**
 * Generating the short url
 * @returns {String} Returns a random 5 characters url
 */
export const generateShortUrl = () => {
  return Math.random().toString(36).substring(2, 7);
};

/**
 * Check if the short url is not in use.
 * @param {String} shortUrl The shorten url.
 * @returns {Boolean} Is the shortener url taken
 */
export const isShortUrlAvailable = (shortUrl: string) =>
  // @ts-ignore
  global.URL_DICT[shortUrl] === undefined;

/**
 * Return the shortener url of the specific url.
 * @param {String} originalUrl The original url.
 * @returns {String} Returns the key or null
 */
export const getShortUrl = (originalUrl: string) => {
  // @ts-ignore

  let urlIndex = Object.values(global.URL_DICT).indexOf(originalUrl);
  // @ts-ignore

  return urlIndex !== -1 ? Object.keys(global.URL_DICT)[urlIndex] : null;
};

/**
 * Add the short url to the server routes.
 * @param {String} originalUrl The original url.
 * @param {String} shortUrl The shorten url.
 */
export const addUrl = (originalUrl: string, shortUrl: string) => {
  // @ts-ignore

  global.URL_DICT[shortUrl] = originalUrl;
};
