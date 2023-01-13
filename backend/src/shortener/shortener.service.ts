import { AppCacheService } from './../cache/cache.service';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class ShortenerService {
  constructor(
    private readonly appCacheService: AppCacheService,
    private readonly appConfigService: AppConfigService
  ) {}

  /**
   * Return the original url of the specific url.
   * @param {String} shortUrl The short url
   * @returns {String} Returns the original url or null
   */
  getOriginalUrl = async (shortUrl: string): Promise<string> => {
    const originalUrl = await this.appCacheService.get(shortUrl);
    return originalUrl ? originalUrl.toString() : null;
  };

  /**
   * Checks if the url has already been shortend by a using a Regular Expression.
   * @param {String} shortUrl The short url
   * @returns {Boolean} Returns a boolean
   */
  isUrlAlreadyShortend = (shortUrl: string): boolean => {
    const domainRegex = new RegExp(this.appConfigService.getConfig().front.domain);
    return domainRegex.test(shortUrl);
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
    const isShortUrlAvailable = await this.isShortUrlAvailable(shortUrl);
    if (!isShortUrlAvailable) {
      throw new Error('Short URL already taken');
    }
    await this.appCacheService.set(shortUrl, originalUrl);
  };
}
