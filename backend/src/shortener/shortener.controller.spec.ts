import { AppConfigModule } from './../config/config.module';
import { AppCacheModule } from './../cache/cache.module';
import { ShortenerService } from './shortener.service';
import { ShortenerController } from './shortener.controller';
import { Test } from '@nestjs/testing';
import { ShortenerDTO } from './dto';
import { BadRequestException } from '@nestjs/common';

describe('ShortenerController', () => {
  let shortenerController: ShortenerController;
  let shortenerService: ShortenerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ShortenerController],
      imports: [AppConfigModule, AppCacheModule],
      providers: [ShortenerService],
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
      jest.spyOn(shortenerService, 'isUrlAlreadyShortend').mockReturnValue(false);

      const body: ShortenerDTO = { originalUrl: 'https://github.com/origranot/reduced.to' };
      const short = await shortenerController.shortener(body);
      expect(short).toStrictEqual({ newUrl: 'best' });
    });

    it('should throw an error of invalid url', () => {
      const body: ShortenerDTO = { originalUrl: 'invalid-url' };
      expect(async () => {
        await shortenerController.shortener(body);
      }).rejects.toThrow(BadRequestException);
    });

    it('should return the original URL when given a valid short URL', async () => {
      jest
        .spyOn(shortenerService, 'getOriginalUrl')
        .mockResolvedValue('https://github.com/origranot/reduced.to');
      const shortUrl = 'best';
      const originalUrl = await shortenerController.findOne(shortUrl);
      expect(originalUrl).toBe('https://github.com/origranot/reduced.to');
    });

    it('should return an error if the short URL is not found in the database', async () => {
      jest.spyOn(shortenerService, 'getOriginalUrl').mockResolvedValue(null);
      const shortUrl = 'not-found';
      try {
        await shortenerController.findOne(shortUrl);
        throw new Error('Expected an error to be thrown!');
      } catch (err) {
        expect(err.message).toBe('Short url is wrong or expired');
      }
    });

    it('should throw an error if the original URL is already shortened', async () => {
      jest.spyOn(shortenerService, 'isUrlAlreadyShortend').mockReturnValue(true);
      const body: ShortenerDTO = { originalUrl: 'https://github.com/origranot/reduced.to' };
      try {
        await shortenerController.shortener(body);
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
      const body: ShortenerDTO = { originalUrl: 'https://github.com/origranot/reduced.to' };
      expect(async () => {
        await shortenerController.shortener(body);
      }).rejects.toThrow();
    });
  });
});
