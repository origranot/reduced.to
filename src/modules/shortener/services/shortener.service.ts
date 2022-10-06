import { Injectable } from '@nestjs/common';

@Injectable()
export class ShortenerService {
  /**
   * Return the shortener url of the specific url.
   * @param {String} originalUrl The original url.
   * @returns {String} Returns the key or null
   */
  getShortUrl(originalUrl: string): string {
    const urlIndex: number = Object.values(global.URL_DICT).indexOf(originalUrl);
    return urlIndex !== -1 ? Object.keys(global.URL_DICT)[urlIndex] : null;
  };

  /**
 * Generating the short url
 * @returns {String} Returns a random 5 characters url
 */
  generateShortUrl = (): string => {
    return Math.random().toString(36).substring(2, 7);
  };

  /**
   * Check if the short url is not in use.
   * @param {String} shortUrl The shorten url.
   * @returns {Boolean} Is the shortener url taken
   */
  isShortUrlAvailable = (shortUrl: string): boolean => {
    return global.URL_DICT[shortUrl] === undefined;
  };

  /**
 * Add the short url to the server routes.
 * @param {String} originalUrl The original url.
 * @param {String} shortUrl The shorten url.
 */
  addUrl = (originalUrl: string, shortUrl: string) => {
    global.URL_DICT[shortUrl] = originalUrl;
  };
}
