import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class ShortenerService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Return the original url of the specific url.
   * @param {String} shortUrl The short url
   * @returns {String} Returns the original url or null
   */
  getOriginalUrl = async (shortUrl: string): Promise<string> => {
    const originalUrl = await this.cacheManager.get(shortUrl);
    return originalUrl ? originalUrl.toString() : null;
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
  isShortUrlAvailable = async (shortUrl: string): Promise<boolean> => {
    const originalUrl = await this.getOriginalUrl(shortUrl);
    return originalUrl === null;
  };

  /**
   * Add the short url to the server routes.
   * @param {String} originalUrl The original url.
   * @param {String} shortUrl The shorten url.
   */
  addUrl = async (originalUrl: string, shortUrl: string) => {
    await this.cacheManager.set(shortUrl, originalUrl);
  };
}
