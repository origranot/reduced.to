import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { Url } from '@reduced.to/prisma';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { AppConfigModule } from '@reduced.to/config';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { IPaginationResult } from '../../shared/utils';
import { SortOrder } from '../../shared/enums/sort-order.enum';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { IFindAllOptions } from '../entity.service';

describe('UrlsController', () => {
  let app: INestApplication;
  let urlsService: UrlsService;

  const MOCKED_URLS: Partial<Url>[] = [
    { id: '1', originalUrl: 'https://reduced.to', shortenedUrl: 'nice' },
    { id: '2', originalUrl: 'https://google.com', shortenedUrl: 'good' },
  ];
  const MOCK_FIND_ALL_RESULT: IPaginationResult<Url> = {
    total: MOCKED_URLS.length,
    data: MOCKED_URLS,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      controllers: [UrlsController],
      providers: [
        {
          provide: UrlsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(MOCK_FIND_ALL_RESULT),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: () => {
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: () => {
          return true;
        },
      })
      .compile();

    app = module.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    urlsService = module.get<UrlsService>(UrlsService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /urls', () => {
    it('should return an array of urls without skip when page is not defined', async () => {
      jest.spyOn(urlsService, 'findAll').mockResolvedValue(MOCK_FIND_ALL_RESULT);

      const response = await request(app.getHttpServer()).get('/urls?limit=100').expect(200);

      expect(urlsService.findAll).toHaveBeenCalledWith({
        limit: 100,
        filter: undefined,
        sort: undefined,
      });
      expect(response.body).toEqual(MOCK_FIND_ALL_RESULT);
    });

    it('should call findAll with correct parameters and add caluclate skip when page is defined', async () => {
      const findAllOptions: IFindAllOptions = { skip: 10, limit: 10 };

      await request(app.getHttpServer()).get('/urls?limit=10&page=2').expect(200);

      expect(urlsService.findAll).toHaveBeenCalledWith(findAllOptions);
    });

    it('should call findAll with correct parameters', async () => {
      const findAllOptions: IFindAllOptions = {
        skip: 10,
        limit: 10,
        filter: 'reduced.to',
        sort: undefined,
      };

      await request(app.getHttpServer()).get('/urls?limit=10&page=2&filter=reduced.to').expect(200);

      expect(urlsService.findAll).toHaveBeenCalledWith(findAllOptions);
    });

    it('should call findAll with correct parameters including sort', async () => {
      const findAllOptions: IFindAllOptions = {
        skip: 10,
        limit: 10,
        filter: 'google.com',
        sort: { expirationTime: SortOrder.ASCENDING, createdAt: SortOrder.DESCENDING },
      };

      await request(app.getHttpServer())
        .get('/urls?limit=10&page=2&filter=google.com&sort[expirationTime]=asc&sort[createdAt]=desc')
        .expect(200);

      expect(urlsService.findAll).toHaveBeenCalledWith(findAllOptions);
    });

    it('should throw an error if limit is not defined in the query', async () => {
      await request(app.getHttpServer()).get('/urls?page=2&filter=some_filter').expect(400);
    });

    it('should throw an error if one of the parameters is invalid', async () => {
      await request(app.getHttpServer()).get('/urls?limit=-5').expect(400);
      await request(app.getHttpServer()).get('/urls?limit=101').expect(400); // limit is above maximum value of 100
      await request(app.getHttpServer()).get('/urls?page=-5').expect(400);
    });

    it('should throw an error if sort is sent with invalid parameters', async () => {
      await request(app.getHttpServer()).get('/urls?sort[name]=invalid').expect(400);
      await request(app.getHttpServer()).get('/urls?sort[invalid]=asc').expect(400);
      await request(app.getHttpServer()).get('/urls?sort[invalid]=invalid').expect(400);
      await request(app.getHttpServer()).get('/urls?sort=name').expect(400);
    });
  });
});
