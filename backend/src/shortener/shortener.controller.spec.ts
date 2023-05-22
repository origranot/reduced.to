import { AppConfigModule } from '../config/config.module';
import { AppCacheModule } from '../cache/cache.module';
import { ShortenerService } from './shortener.service';
import { ShortenerController } from './shortener.controller';
import { Test } from '@nestjs/testing';
import { ShortenerDto } from './dto';
import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

describe('ShortenerController', () => {
  let shortenerController: ShortenerController;
  let shortenerService: ShortenerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ShortenerController],
      imports: [AppConfigModule, AppCacheModule],
      providers: [
        ShortenerService,
        {
          provide: PrismaService,
          useFactory: () => ({
            url: {
              create: jest.fn(),
              findFirst: jest.fn(),
            },
          }),
        },
      ],
    }).compile();

    shortenerService = moduleRef.get<ShortenerService>(ShortenerService);
    shortenerController = moduleRef.get<ShortenerController>(ShortenerController);
  });

  it('should be defined', () => {
    expect(shortenerController).toBeDefined();
  });

  describe('shortener', () => {
    it('should return a shortern url', async () => {
      jest.spyOn(shortenerService, 'generateShortUrl').mockReturnValue('best');
      jest.spyOn(shortenerService, 'isShortUrlAvailable').mockResolvedValue(true);
      jest.spyOn(shortenerService, 'addUrl').mockResolvedValue(undefined);
      jest.spyOn(shortenerService, 'isUrlAlreadyShortened').mockReturnValue(false);

      const body: ShortenerDto = { originalUrl: 'https://github.com/origranot/reduced.to' };
      const req = {} as any as Request;
      const short = await shortenerController.shortener(body, req);
      expect(short).toStrictEqual({ newUrl: 'best', isUserAuthenticated: false });
    });

    it('should throw an error of invalid url', () => {
      const body: ShortenerDto = { originalUrl: 'invalid-url' };
      const req = { user: { id: 'user_id' } } as any as Request;
      expect(async () => {
        await shortenerController.shortener(body, req);
      }).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the original URL is already shortened', async () => {
      jest.spyOn(shortenerService, 'isUrlAlreadyShortened').mockReturnValue(true);
      const body: ShortenerDto = { originalUrl: 'https://github.com/origranot/reduced.to' };
      const req = { user: { id: 'user_id' } } as any as Request;

      try {
        await shortenerController.shortener(body, req);
        throw new Error('Expected an error to be thrown!');
      } catch (err) {
        expect(err.message).toBe('The URL is already shortened...');
      }
    });

    it('should return an error if addUrl method throws an error', () => {
      jest.spyOn(shortenerService, 'generateShortUrl').mockReturnValue('best');
      jest.spyOn(shortenerService, 'isShortUrlAvailable').mockResolvedValue(true);
      jest
        .spyOn(shortenerService, 'addUrl')
        .mockRejectedValue(new Error('Error adding URL to the database'));
      const body: ShortenerDto = { originalUrl: 'https://github.com/origranot/reduced.to' };
      const req = { user: { id: 'user_id' } } as any as Request;
      expect(async () => {
        await shortenerController.shortener(body, req);
      }).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('should return the original URL when given a valid short URL', async () => {
      jest
        .spyOn(shortenerService, 'getOriginalUrl')
        .mockResolvedValue('https://github.com/origranot/reduced.to');
      const shortUrl = 'best';
      const originalUrl = await shortenerController.findOne(shortUrl);
      expect(originalUrl).toBe('https://github.com/origranot/reduced.to');
    });

    it('should return the original URL when given a premium short URL', async () => {
      jest.spyOn(shortenerService, 'getOriginalUrl').mockResolvedValue(null);
      jest
        .spyOn(shortenerService, 'getPremiumUrl')
        .mockResolvedValue('https://github.com/origranot/reduced.to');
      const shortUrl = 'bestPremium';
      const originalUrl = await shortenerController.findOne(shortUrl);
      expect(originalUrl).toBe('https://github.com/origranot/reduced.to');
    });

    it('should return an error if the short URL is not found in the database', async () => {
      jest.spyOn(shortenerService, 'getOriginalUrl').mockResolvedValue(null);
      jest.spyOn(shortenerService, 'getPremiumUrl').mockResolvedValue(null);
      const shortUrl = 'not-found';
      try {
        await shortenerController.findOne(shortUrl);
        throw new Error('Expected an error to be thrown!');
      } catch (err) {
        expect(err.message).toBe('Short url is wrong or expired');
      }
    });
  });
});
