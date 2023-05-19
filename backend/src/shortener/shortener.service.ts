import { AppCacheService } from '../cache/cache.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AppConfigService } from '../config/config.service';
import { PrismaService } from '../prisma/prisma.service';
import { ShortenerDTO, UserShortenerDto } from './dto';
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
    if (originalUrl) {
      return false;
    }
    const userShortUrl = await this.getUserUrl(shortUrl);
    return userShortUrl === null;
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

  createShortUrl = async (
    body: ShortenerDTO
  ): Promise<{
    newUrl: string;
  }> => {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(body.originalUrl);

      // Checks if the URL is already reduced.
      if (this.isUrlAlreadyShortend(body.originalUrl)) {
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

  async createUserUrl(body: UserShortenerDto, user: UserContext) {
    const { newUrl } = await this.createShortUrl({ originalUrl: body.originalUrl });
    return await this.prisma.shortUrl.create({
      data: {
        shortUrl: newUrl,
        originalUrl: body.originalUrl,
        userId: user.id,
        description: body.description,
        expirationTime: body.expirationTime,
      },
    });
  }

  async getUserUrl(shortUrl: string) {
    const userUrl = await this.prisma.shortUrl.findFirst({
      where: {
        shortUrl,
        expirationTime: {
          gt: new Date(),
        },
      },
    });
    return userUrl ? userUrl.originalUrl : null;
  }
}
