import { ShortenerService } from './shortener.service';
import { ShortenerController } from './shortener.controller';
import { Test } from '@nestjs/testing';
import { ShortenerDTO } from './dto';
import { BadRequestException } from '@nestjs/common';

jest.mock('./shortener.service.ts');

describe('ShortenerController', () => {
  let shortenerController: ShortenerController;
  let shortenerService: ShortenerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ShortenerController],
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
      const result = { newUrl: 'best' };
      mockShortenerControllerResults(result.newUrl, true);

      const body: ShortenerDTO = { originalUrl: 'https://github.com/origranot/reduced.to' };
      const short = await shortenerController.shortener(body);

      expect(short).toStrictEqual(result);
    });

    it('should throw an error of invalid url', () => {
      const body: ShortenerDTO = { originalUrl: 'invalid-url' };
      expect(async () => {
        await shortenerController.shortener(body);
      }).rejects.toThrow(BadRequestException);
    });
  });

  const mockShortenerControllerResults = (shortUrl: string, isAvialble: boolean) => {
    jest.spyOn(shortenerService, 'generateShortUrl').mockReturnValue(shortUrl);
    jest.spyOn(shortenerService, 'isShortUrlAvailable').mockResolvedValue(isAvialble);
  };
});
