import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Link } from '@reduced.to/prisma';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { AppConfigModule } from '@reduced.to/config';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { IPaginationResult } from '../../shared/utils';
import { SortOrder } from '../../shared/enums/sort-order.enum';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { IFindAllOptions } from '../entity.service';

describe('LinksController', () => {
  let app: INestApplication;
  let linksService: LinksService;

  const MOCKED_LINKS: Partial<Link>[] = [
    { id: '1', url: 'https://reduced.to', key: 'nice' },
    { id: '2', url: 'https://google.com', key: 'good' },
  ];
  const MOCK_FIND_ALL_RESULT: IPaginationResult<Link> = {
    total: MOCKED_LINKS.length,
    data: MOCKED_LINKS,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      controllers: [LinksController],
      providers: [
        {
          provide: LinksService,
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

    linksService = module.get<LinksService>(LinksService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /links', () => {
    it('should return an array of urls without skip when page is not defined', async () => {
      jest.spyOn(linksService, 'findAll').mockResolvedValue(MOCK_FIND_ALL_RESULT);

      const response = await request(app.getHttpServer()).get('/links?limit=100').expect(200);

      expect(linksService.findAll).toHaveBeenCalledWith({
        limit: 100,
        filter: undefined,
        sort: undefined,
        extraWhereClause: { userId: undefined },
      });
      expect(response.body).toEqual(MOCK_FIND_ALL_RESULT);
    });

    it('should call findAll with correct parameters and add caluclate skip when page is defined', async () => {
      const findAllOptions: IFindAllOptions = {
        skip: 10,
        limit: 10,
        extraWhereClause: { userId: undefined },
        filter: undefined,
        sort: undefined,
      };

      await request(app.getHttpServer()).get('/links?limit=10&page=2').expect(200);

      expect(linksService.findAll).toHaveBeenCalledWith(findAllOptions);
    });

    it('should call findAll with correct parameters', async () => {
      const findAllOptions: IFindAllOptions = {
        skip: 10,
        limit: 10,
        filter: 'reduced.to',
        sort: undefined,
        extraWhereClause: { userId: undefined },
      };

      await request(app.getHttpServer()).get('/links?limit=10&page=2&filter=reduced.to').expect(200);

      expect(linksService.findAll).toHaveBeenCalledWith(findAllOptions);
    });

    it('should call findAll with correct parameters including sort', async () => {
      const findAllOptions: IFindAllOptions = {
        skip: 10,
        limit: 10,
        filter: 'google.com',
        sort: { expirationTime: SortOrder.ASCENDING, createdAt: SortOrder.DESCENDING },
        extraWhereClause: { userId: undefined },
      };

      await request(app.getHttpServer())
        .get('/links?limit=10&page=2&filter=google.com&sort[expirationTime]=asc&sort[createdAt]=desc')
        .expect(200);

      expect(linksService.findAll).toHaveBeenCalledWith(findAllOptions);
    });

    it('should throw an error if limit is not defined in the query', async () => {
      await request(app.getHttpServer()).get('/links?page=2&filter=some_filter').expect(400);
    });

    it('should throw an error if one of the parameters is invalid', async () => {
      await request(app.getHttpServer()).get('/links?limit=-5').expect(400);
      await request(app.getHttpServer()).get('/links?limit=101').expect(400); // limit is above maximum value of 100
      await request(app.getHttpServer()).get('/links?page=-5').expect(400);
    });

    it('should throw an error if sort is sent with invalid parameters', async () => {
      await request(app.getHttpServer()).get('/links?sort[name]=invalid').expect(400);
      await request(app.getHttpServer()).get('/links?sort[invalid]=asc').expect(400);
      await request(app.getHttpServer()).get('/links?sort[invalid]=invalid').expect(400);
      await request(app.getHttpServer()).get('/links?sort=name').expect(400);
    });
  });
});
