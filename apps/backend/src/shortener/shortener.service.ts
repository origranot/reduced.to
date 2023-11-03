import { AppCacheService } from '../cache/cache.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AppConfigService } from '@reduced.to/config';
import { PrismaService } from '@reduced.to/prisma';
import { ShortenerDto } from './dto';
import { UserContext } from '../auth/interfaces/user-context';
import { Link } from '@reduced.to/prisma';
import { calculateDateFromTtl } from '../shared/utils';

@Injectable()
export class ShortenerService {
  constructor(
    private readonly appCacheService: AppCacheService,
    private readonly prisma: PrismaService,
    private readonly appConfigService: AppConfigService
  ) {}

  /**
   * Retrieves the original URL associated with a given shortened URL.
   * @param {string} key - The key of the shortened URL.
   * @returns {Promise<string|null>} - The original URL if found, otherwise null.
   */
  getUrl = async (key: string): Promise<string | null> => {
    const url = await this.getLinkFromCache(key);
    if (url) {
      return url;
    }
    return this.getLinkFromDb(key);
  };

  /**
   * Retrieves the original URL from the cache based on a given shortened URL.
   * @param {string} key - The key of the shortened URL.
   * @returns {Promise<string|null>} - The original URL if found in the cache, otherwise null.
   */
  getLinkFromCache = async (key: string): Promise<string> => {
    const url = await this.appCacheService.get(key);
    return url ? url.toString() : null;
  };

  /**
   * Checks if the url has already been shortened by a using a Regular Expression.
   * @param {string} url The original url.
   * @returns {boolean} Returns a boolean
   */
  isUrlAlreadyShortened = (url: string): boolean => {
    const domainRegex = new RegExp(this.appConfigService.getConfig().front.domain);
    return domainRegex.test(url);
  };

  /**
   * Generating the short url
   * @returns {string} Returns a random 5 characters url
   */
  generateKey = (): string => {
    return Math.random().toString(36).substring(2, 7);
  };

  /**
   * Checks if a shortened URL is available (not in use).
   * @param {string} shortenedUrl - The shortened URL.
   * @returns {Promise<boolean>} - True if the shortened URL is available, false otherwise.
   */
  isKeyAvailable = async (shortenedUrl: string): Promise<boolean> => {
    const url = await this.getUrl(shortenedUrl);
    return url === null;
  };

  /**
   * Add the short url to the cache
   * @param {string} url The original url.
   * @param {string} key The url key.
   * @param {number} ttl The time to live.
   */
  addLinkToCache = async (url: string, key: string, ttl?: number) => {
    const minTtl = Math.min(this.appConfigService.getConfig().redis.ttl, ttl);
    await this.appCacheService.set(key, url, minTtl || this.appConfigService.getConfig().redis.ttl);
  };

  /**
   * Create a short URL based on the provided data.
   * @param {string} url - The original URL.
   * @param {number} ttl The time to live.
   * @returns {Promise<{ key: string }>} Returns an object containing the newly created key.
   */
  createShortenedUrl = async (url: string, ttl?: number): Promise<{ key: string }> => {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);

      // Checks if the URL is already reduced.
      if (this.isUrlAlreadyShortened(url)) {
        throw new Error('The URL is already shortened...');
      }
    } catch (err) {
      throw new BadRequestException(err.message || 'URL is invalid');
    }

    let shortUrl: string;

    do {
      shortUrl = this.generateKey();
    } while (!(await this.isKeyAvailable(shortUrl)));

    await this.addLinkToCache(parsedUrl.href, shortUrl, ttl);
    return { key: shortUrl };
  };

  /**
   * Create a db URL based on the provided data and user context.
   * @param {ShortenerDto} shortenerDto The data for creating a db URL.
   * @param {UserContext} user The user context.
   * @param {string} key The key of the shortened URL.
   * @returns {Promise<any>} Returns the created db URL.
   */
  createDbUrl = async (user: UserContext, shortenerDto: ShortenerDto, key: string): Promise<Link> => {
    const { url, description, ttl } = shortenerDto;

    return this.prisma.link.create({
      data: {
        key,
        url,
        userId: user.id,
        description,
        // If the ttl is provided, set the expiration time to the current time plus the ttl.
        ...(ttl && { expirationTime: calculateDateFromTtl(ttl) }),
      },
    });
  };

  /**
   * Retrieves the original URL associated with a given short URL from the database.
   * @param {string} key The key of the shortened URL.
   * @returns {Promise<string|null>} - The original URL if the original URL is found and valid, otherwise null.
   */
  getLinkFromDb = async (key: string): Promise<string | null> => {
    const link = await this.prisma.link.findFirst({
      where: {
        key,
      },
    });

    if (!link || (link?.expirationTime && link.expirationTime < new Date())) {
      return null;
    }

    // If the URL has an expiration time, calculate the TTL.
    let ttl: number;
    if (link.expirationTime) {
      ttl = link.expirationTime.getTime() - new Date().getTime();
    }

    // Add the URL back to the cache to prevent future database calls.
    this.addLinkToCache(link.url, key, ttl);

    return link.url;
  };

  /**
   * Creates a shortened URL for a user based on the provided data.
   * @param {UserContext} user - The user context.
   * @param {ShortenerDto} shortenerDto - The request body containing the original URL and optional expiration time.
   * @returns {Promise<{ key: string }>} - Returns an object containing the newly created short URL.
   */
  createUsersShortenedUrl = async (user: UserContext, shortenerDto: ShortenerDto): Promise<{ key: string }> => {
    const { key } = await this.createShortenedUrl(shortenerDto.url, shortenerDto.ttl);
    await this.createDbUrl(user, shortenerDto, key);

    return { key };
  };
}
