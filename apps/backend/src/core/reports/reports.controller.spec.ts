import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PrismaService, Report } from '@reduced.to/prisma';
import { IPaginationResult } from '../../shared/utils';
import { AppConfigModule } from '@reduced.to/config';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { IFindAllOptions } from '../entity.service';
import { SortOrder } from '../../shared/enums/sort-order.enum';
import { LinksService } from '../links/links.service';

describe('ReportsController', () => {
  let app: INestApplication;
  let reportsService: ReportsService;
  let linksService: LinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      controllers: [ReportsController],
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: {
            report: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: LinksService,
          useValue: {
            findBy: jest.fn(),
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

    reportsService = module.get<ReportsService>(ReportsService);
    linksService = module.get<LinksService>(LinksService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /reports', () => {
    const MOCKED_REPORTS: Partial<Report>[] = [
      { id: '1', key: 'abcde', url: 'https://google.com' },
      { id: '2', key: 'qwert', url: 'https://github.com' },
    ];

    const MOCK_FIND_ALL_RESULT: IPaginationResult<Report> = {
      total: MOCKED_REPORTS.length,
      data: MOCKED_REPORTS,
    };

    beforeEach(() => {
      jest.spyOn(reportsService, 'findAll').mockResolvedValue(MOCK_FIND_ALL_RESULT);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return an array of reports without skip when page is not defined', async () => {
      const response = await request(app.getHttpServer()).get('/reports?limit=100').expect(200);

      expect(reportsService.findAll).toHaveBeenCalledWith({
        limit: 100,
        filter: undefined,
        sort: undefined,
      });
      expect(response.body).toEqual(MOCK_FIND_ALL_RESULT);
    });

    it('should call findAll with correct parameters and add caluclate skip when page is defined', async () => {
      const findAllOptions: IFindAllOptions = {
        skip: 10,
        limit: 10,
        filter: undefined,
        sort: undefined,
      };

      await request(app.getHttpServer()).get('/reports?limit=10&page=2').expect(200);

      expect(reportsService.findAll).toHaveBeenCalledWith(findAllOptions);
    });

    it('should call findAll with correct parameters', async () => {
      const findAllOptions: IFindAllOptions = {
        skip: 10,
        limit: 10,
        filter: 'reduced.to',
        sort: undefined,
      };

      await request(app.getHttpServer()).get('/reports?limit=10&page=2&filter=reduced.to').expect(200);

      expect(reportsService.findAll).toHaveBeenCalledWith(findAllOptions);
    });

    it('should call findAll with correct parameters including sort', async () => {
      const findAllOptions: IFindAllOptions = {
        skip: 10,
        limit: 10,
        filter: 'google.com',
        sort: { createdAt: SortOrder.DESCENDING },
      };

      await request(app.getHttpServer()).get('/reports?limit=10&page=2&filter=google.com&sort[createdAt]=desc').expect(200);

      expect(reportsService.findAll).toHaveBeenCalledWith(findAllOptions);
    });

    it('should throw an error if limit is not defined in the query', async () => {
      await request(app.getHttpServer()).get('/reports?page=2&filter=some_filter').expect(400);
    });

    it('should throw an error if one of the parameters is invalid', async () => {
      await request(app.getHttpServer()).get('/reports?limit=-5').expect(400);
      await request(app.getHttpServer()).get('/reports?limit=101').expect(400); // limit is above maximum value of 100
      await request(app.getHttpServer()).get('/reports?page=-5').expect(400);
    });

    it('should throw an error if sort is sent with invalid parameters', async () => {
      await request(app.getHttpServer()).get('/reports?sort[name]=invalid').expect(400);
      await request(app.getHttpServer()).get('/reports?sort[invalid]=asc').expect(400);
      await request(app.getHttpServer()).get('/reports?sort[invalid]=invalid').expect(400);
      await request(app.getHttpServer()).get('/reports?sort=name').expect(400);
    });
  });

  describe('POST /reports', () => {
    beforeEach(async () => {
      jest.spyOn(reportsService['config'], 'getConfig').mockReturnValue({ front: { domain: 'reduced.to' } } as any);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 201 if report is created successfully', async () => {
      jest.spyOn(linksService, 'findBy').mockResolvedValue({ url: 'https://github.com/origranot/reduced.to' } as any);

      const response = await request(app.getHttpServer())
        .post('/reports')
        .send({ link: 'https://reduced.to/abcde', category: 'test' })
        .expect(201);

      expect(response.body).toEqual({});
    });

    it('should return 404 if link is not found', async () => {
      jest.spyOn(linksService, 'findBy').mockResolvedValue({ url: undefined } as any);

      await request(app.getHttpServer()).post('/reports').send({ link: 'https://reduced.to/abcde', category: 'test' }).expect(404);
    });

    const TEST_CASES = [
      ['http://reduced.to/123', true],
      ['https://reduced.to/abcde', true],
      ['https://reduced.to/orig', true],
      ['https://google.com', false],
      ['https://reduced.to', false],
      ['https://reduced.to/abcde?test=1', false],
      ['https://reduced.to/abcde/', false],
      ['https://reduced.to/abcde/123', false],
    ];
    it.each(TEST_CASES)('should return %p if link is %s shortened by us', async (link, result) => {
      jest.spyOn(linksService, 'findBy').mockResolvedValue({ url: 'https://google.com' } as any);

      await request(app.getHttpServer())
        .post('/reports')
        .send({ link, category: 'test' })
        .expect(result ? 201 : 400);
    });

    it('should return 400 if link is not valid', async () => {
      await request(app.getHttpServer()).post('/reports').send({ link: 'invalid', category: 'test' }).expect(400);
      await request(app.getHttpServer()).post('/reports').send({ link: 'not_a_link', category: 'test' }).expect(400);
      await request(app.getHttpServer()).post('/reports').send({ link: 1234567, category: 'test' }).expect(400);
      await request(app.getHttpServer()).post('/reports').send({ link: undefined, category: 'test' }).expect(400);
      await request(app.getHttpServer()).post('/reports').send({ link: null, category: 'test' }).expect(400);
    });

    it('should return 400 if category is not valid', async () => {
      await request(app.getHttpServer()).post('/reports').send({ link: 'https://reduced.to/abcde', category: null }).expect(400);
      await request(app.getHttpServer()).post('/reports').send({ link: 'https://reduced.to/abcde', category: 123 }).expect(400);
      await request(app.getHttpServer()).post('/reports').send({ link: 'https://reduced.to/abcde', category: undefined }).expect(400);
    });
  });

  describe('DELETE /reports/:id', () => {
    beforeEach(() => {
      jest.spyOn(reportsService, 'delete').mockResolvedValue({} as any);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 200 if report is deleted successfully', async () => {
      jest.spyOn(linksService, 'findBy').mockResolvedValue({ url: 'https://google.com' } as any);

      await request(app.getHttpServer()).delete('/reports/1').expect(200);
    });

    it('should return 404 if report is not found', async () => {
      jest.spyOn(linksService, 'findBy').mockResolvedValue(null);

      await request(app.getHttpServer()).delete('/reports/1').expect(404);
    });
  });
});
