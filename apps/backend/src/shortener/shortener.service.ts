import { AppCacheService, LinkValue } from '../cache/cache.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AppConfigService } from '@reduced.to/config';
import { PrismaService } from '@reduced.to/prisma';
import { ShortenerDto } from './dto';
import { UserContext } from '../auth/interfaces/user-context';
import { Link } from '@reduced.to/prisma';
import * as argon2 from 'argon2';
import { createUtmObject } from '../shared/utils/utm/utm';

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
  getLink = async (key: string): Promise<LinkValue | null> => {
    const value = await this.getLinkFromCache(key);
    return value ? value : this.getLinkFromDb(key);
  };

  /**
   * Retrieves the original URL from the cache based on a given shortened URL.
   * @param {string} key - The key of the shortened URL.
   * @returns {Promise<string|null>} - The original URL if found in the cache, otherwise null.
   */
  getLinkFromCache = async (key: string): Promise<LinkValue> => {
    const value = await this.appCacheService.get(key);
    return value ?? null;
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
    const value = await this.getLink(shortenedUrl);
    return value === null;
  };

  addLinkToCache = async (key: string, value: LinkValue, ttl?: number) => {
    const minTtl = Math.min(this.appConfigService.getConfig().redis.ttl, ttl);
    if (minTtl < 0) {
      return;
    }

    await this.appCacheService.set(key, value, minTtl || this.appConfigService.getConfig().redis.ttl);
  };

  createShortenedUrl = async (dto: ShortenerDto, utm?: Record<string, string>): Promise<{ key: string }> => {
    const { url, expirationTime, password } = dto;

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

    let key: string;

    do {
      key = this.generateKey();
    } while (!(await this.isKeyAvailable(key)));

    const ttl = expirationTime ? expirationTime - new Date().getTime() : undefined;

    await this.addLinkToCache(key, { url: parsedUrl.href, key, password, utm }, ttl);
    return { key };
  };

  hashPassword = async (password: string): Promise<string> => {
    return argon2.hash(password);
  };

  verifyPassword = async (hash: string, password: string): Promise<boolean> => {
    return argon2.verify(hash, password);
  };

  /**
   * Create a db URL based on the provided data and user context.
   * @param {ShortenerDto} shortenerDto The data for creating a db URL.
   * @param {UserContext} user The user context.
   * @param {string} key The key of the shortened URL.
   * @returns {Promise<any>} Returns the created db URL.
   */
  createDbUrl = async (user: UserContext, shortenerDto: ShortenerDto, key: string, utm?: Record<string, string>): Promise<Link> => {
    const { url, description, expirationTime, password } = shortenerDto;

    const data = {
      userId: user.id,
      key,
      url,
      description,
      ...(expirationTime && { expirationTime: new Date(expirationTime) }),
      utm,
    };

    if (password && shortenerDto.temporary) {
      throw new BadRequestException('Temporary links cannot be password protected');
    }

    return this.prisma.link.create({ data });
  };

  /**
   * Retrieves the original URL associated with a given short URL from the database.
   * @param {string} key The key of the shortened URL.
   * @returns {Promise<string|null>} - The original URL if the original URL is found and valid, otherwise null.
   */
  getLinkFromDb = async (key: string): Promise<LinkValue | null> => {
    const link = await this.prisma.link.findFirst({
      where: {
        key,
      },
    });

    if (!link) {
      return null;
    }

    // If the URL has an expiration time, calculate the TTL.
    let expirationTime: number;
    if (link.expirationTime) {
      if (new Date(link.expirationTime.getTime()) < new Date()) {
        return null;
      }
      expirationTime = link.expirationTime.getTime() - new Date().getTime();
    }

    // Add the URL back to the cache to prevent future database calls.
    this.addLinkToCache(key, { url: link.url, key, password: link.password, utm: link.utm }, expirationTime);

    return link;
  };

  /**
   * Creates a shortened URL for a user based on the provided data.
   * @param {UserContext} user - The user context.
   * @param {ShortenerDto} shortenerDto - The request body containing the original URL and optional expiration time.
   * @returns {Promise<{ key: string }>} - Returns an object containing the newly created short URL.
   */
  createUsersShortenedUrl = async (user: UserContext, shortenerDto: ShortenerDto): Promise<{ key: string }> => {
    const utm = createUtmObject({
      ref: shortenerDto.utm_ref,
      utm_source: shortenerDto.utm_source,
      utm_medium: shortenerDto.utm_medium,
      utm_campaign: shortenerDto.utm_campaign,
      utm_term: shortenerDto.utm_term,
      utm_content: shortenerDto.utm_content,
    });

    const { key } = await this.createShortenedUrl(shortenerDto, utm);
    await this.createDbUrl(user, shortenerDto, key, utm);

    return { key };
  };
}
