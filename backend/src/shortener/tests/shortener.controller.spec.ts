import { Test, TestingModule } from '@nestjs/testing';
import { ShortenerController } from '../shortener.controller';
import { ShortenerService } from '../shortener.service';
import { ShortenerDTO } from '../dto';

jest.mock('../shortener.service');

describe('ShortenerController', () => {
  let controller: ShortenerController;
  let service: ShortenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortenerController],
      providers: [
        {
          provide: ShortenerService,
          useValue: {
            generateShortUrl: jest.fn((x) => 'abcde'),
            isShortUrlAvailable: jest.fn((x) => true),
            addUrl: jest.fn((x, y) => x + y),
          },
        },
      ],
    }).compile();

    controller = module.get<ShortenerController>(ShortenerController);
    service = module.get<ShortenerService>(ShortenerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call call the service methods', async () => {
    const mReq = {
      originalUrl: 'https://www.google.com',
    } as ShortenerDTO;

    const mRes = {
      newUrl: 'abcde',
    };

    expect(await controller.shortener(mReq)).toEqual(mRes);
    expect(service.generateShortUrl).toBeCalledTimes(1);
    expect(service.isShortUrlAvailable).toBeCalledTimes(1);
    expect(service.addUrl).toBeCalledTimes(1);
  });
});
