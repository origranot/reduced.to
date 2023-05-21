import { AppCacheService } from '../cache/cache.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AppConfigService } from '../config/config.service';
import { PrismaService } from '../prisma/prisma.service';
import { ShortenerDto } from './dto';
import { UserContext } from '../auth/interfaces/user-context';

@Injectable()
export class ShortenerService {
  constructor(
    private readonly appCacheService: AppCacheService,
    private readonly prisma: PrismaService,
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
   * Checks if the url has already been shortened by a using a Regular Expression.
   * @param {String} shortUrl The short url
   * @returns {Boolean} Returns a boolean
   */
  isUrlAlreadyShortened = (shortUrl: string): boolean => {
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
    if (originalUrl) {
      return false;
    }
    const premiumUrl = await this.getPremiumUrl(shortUrl);
    return premiumUrl === null;
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

  /**
   * Create a short URL based on the provided data.
   * @param {ShortenerDto} body The data for creating a short URL.
   * @returns {Promise<{ newUrl: string }>} Returns an object containing the newly created short URL.
   */
  createShortUrl = async (
    body: ShortenerDto
  ): Promise<{
    newUrl: string;
  }> => {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(body.originalUrl);

      // Checks if the URL is already reduced.
      if (this.isUrlAlreadyShortened(body.originalUrl)) {
        throw new Error('The URL is already shortened...');
      }
    } catch (err: any) {
      throw new BadRequestException(err.message || 'URL is invalid');
    }

    let shortUrl: string;

    do {
      shortUrl = this.generateShortUrl();
    } while (!(await this.isShortUrlAvailable(shortUrl)));

    await this.addUrl(parsedUrl.href, shortUrl);
    return { newUrl: shortUrl };
  };

  /**
   * Create a premium URL based on the provided data and user context.
   * @param {ShortenerDto} body The data for creating a premium URL.
   * @param {UserContext} user The user context.
   * @param {string} newUrl The new short URL.
   * @returns {Promise<any>} Returns the created premium URL.
   */
  async createPremiumUrl(body: ShortenerDto, user: UserContext, newUrl: string) {
    return await this.prisma.url.create({
      data: {
        shortenedUrl: newUrl,
        originalUrl: body.originalUrl,
        userId: user.id,
        description: body.description,
        expirationTime: body.expirationTime,
      },
    });
  }

  /**
   * Get the premium URL associated with the given short URL.
   * @param {string} shortenedUrl The short URL.
   * @returns {Promise<string|null>} Returns the original URL if the premium URL is found and valid, null otherwise.
   */
  async getPremiumUrl(shortenedUrl: string) {
    const premiumUrl = await this.prisma.url.findFirst({
      where: {
        shortenedUrl,
        expirationTime: {
          gt: new Date(),
        },
      },
    });
    return premiumUrl ? premiumUrl.originalUrl : null;
  }
}
