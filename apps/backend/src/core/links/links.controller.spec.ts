import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Link, Role } from '@rt/prisma';
import { JwtAuthGuard } from '@rt/backend/auth/guards/jwt.guard';
import { AppConfigModule } from '@rt/config';
import { RolesGuard } from '@rt/backend/auth/guards/roles.guard';
import { IPaginationResult } from '@rt/backend/shared/utils';
import { SortOrder } from '@rt/backend/shared/enums/sort-order.enum';
import { LinksService } from '@rt/backend/core/links/links.service';
import { LinksController } from '@rt/backend/core/links/links.controller';
import { IFindAllOptions } from '@rt/backend/core/entity.service';

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

  const MOCK_USER_CONTEXT = {
    id: '8940dbd3-c7d0-455d-aa37-cb8c380cf461',
    role: Role.USER,
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
            findBy: jest.fn().mockResolvedValue(MOCKED_LINKS[0]),
            delete: jest.fn().mockResolvedValue(MOCKED_LINKS[0]),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = MOCK_USER_CONTEXT;
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
        extraWhereClause: { userId: expect.anything() },
      });
      expect(response.body).toEqual(MOCK_FIND_ALL_RESULT);
    });

    it('should call findAll with correct parameters and add caluclate skip when page is defined', async () => {
      const findAllOptions: IFindAllOptions = {
        skip: 10,
        limit: 10,
        extraWhereClause: { userId: expect.anything() },
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
        extraWhereClause: { userId: expect.anything() },
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
        extraWhereClause: { userId: expect.anything() },
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

  describe('DELETE /links/:id', () => {
    it('should delete the link if the user is authorized and the link exists', async () => {
      const linkToDelete = MOCKED_LINKS[0];
      jest.spyOn(linksService, 'findAll').mockResolvedValue(MOCK_FIND_ALL_RESULT);
      jest.spyOn(linksService, 'findBy').mockResolvedValue(linkToDelete as Link);
      jest.spyOn(linksService, 'delete').mockResolvedValue(linkToDelete as Link);

      const response = await request(app.getHttpServer()).delete(`/links/${linkToDelete.id}`).expect(200);

      expect(linksService.findBy).toHaveBeenCalledWith({
        userId: expect.anything(),
        id: linkToDelete.id,
      });

      expect(linksService.delete).toHaveBeenCalledWith(linkToDelete.id);
      expect(response.body).toEqual(linkToDelete);
    });

    it('should throw an UnauthorizedException if the link does not belong to the user', async () => {
      jest.spyOn(linksService, 'findBy').mockResolvedValue(null);

      await request(app.getHttpServer()).delete('/links/invalid-link-id').expect(401); // 401 Unauthorized

      expect(linksService.findBy).toHaveBeenCalledWith({
        userId: expect.anything(),
        id: 'invalid-link-id',
      });
      expect(linksService.delete).not.toHaveBeenCalled();
    });

    it('should throw an error if the link does not exist', async () => {
      jest.spyOn(linksService, 'findBy').mockResolvedValue(undefined);
      jest.spyOn(linksService, 'delete').mockResolvedValue(undefined);

      await request(app.getHttpServer()).delete('/links/non-existent-id').expect(401); // 401 Unauthorized as the link is not found

      expect(linksService.findBy).toHaveBeenCalledWith({
        userId: expect.anything(),
        id: 'non-existent-id',
      });
      expect(linksService.delete).not.toHaveBeenCalled();
    });
  });
});
