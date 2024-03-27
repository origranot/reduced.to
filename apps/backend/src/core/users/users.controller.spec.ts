import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { UsersController } from '@rt/backend/core/users/users.controller';
import { UsersService } from '@rt/backend/core/users/users.service';
import { User } from '@rt/prisma';
import { IPaginationResult } from '@rt/backend/shared/utils';
import { AppConfigModule } from '@rt/config';
import { JwtAuthGuard } from '@rt/backend/auth/guards/jwt.guard';
import { RolesGuard } from '@rt/backend/auth/guards/roles.guard';
import { IFindAllOptions } from '@rt/backend/core/entity.service';
import { SortOrder } from '@rt/backend/shared/enums/sort-order.enum';
import { StorageService } from '@rt/backend/storage/storage.service';
import { AppLoggerModule } from '@rt/logger';
import { AuthService } from '@rt/backend/auth/auth.service';

describe('UsersController', () => {
  let app: INestApplication;
  let usersService: UsersService;

  const MOCKED_USERS: Partial<User>[] = [
    { id: '1', name: 'John' },
    { id: '2', name: 'Jane' },
  ];
  const MOCK_FIND_ALL_RESULT: IPaginationResult<User> = {
    total: MOCKED_USERS.length,
    data: MOCKED_USERS,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule, AppLoggerModule],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(MOCK_FIND_ALL_RESULT),
          },
        },
        {
          provide: StorageService,
          useValue: jest.fn(),
        },
        {
          provide: AuthService,
          useValue: jest.fn(),
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

    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('should return an array of users without skip when page is not defined', async () => {
      jest.spyOn(usersService, 'findAll').mockResolvedValue(MOCK_FIND_ALL_RESULT);

      const response = await request(app.getHttpServer()).get('/users?limit=100').expect(200);

      expect(usersService.findAll).toHaveBeenCalledWith({
        limit: 100,
        filter: undefined,
        sort: undefined,
      });
      expect(response.body).toEqual(MOCK_FIND_ALL_RESULT);
    });

    it('should call findAll with correct parameters and add caluclate skip when page is defined', async () => {
      const findAllOptions: IFindAllOptions = { skip: 10, limit: 10 };

      await request(app.getHttpServer()).get('/users?limit=10&page=2').expect(200);

      expect(usersService.findAll).toHaveBeenCalledWith(findAllOptions);
    });

    it('should call findAll with correct parameters', async () => {
      const findAllOptions: IFindAllOptions = {
        skip: 10,
        limit: 10,
        filter: 'test@test.com',
        sort: undefined,
      };

      await request(app.getHttpServer()).get('/users?limit=10&page=2&filter=test@test.com').expect(200);

      expect(usersService.findAll).toHaveBeenCalledWith(findAllOptions);
    });

    it('should call findAll with correct parameters including sort', async () => {
      const findAllOptions: IFindAllOptions = {
        skip: 10,
        limit: 10,
        filter: 'test@test.com',
        sort: { name: SortOrder.ASCENDING, createdAt: SortOrder.DESCENDING },
      };

      await request(app.getHttpServer()).get('/users?limit=10&page=2&filter=test@test.com&sort[name]=asc&sort[createdAt]=desc').expect(200);

      expect(usersService.findAll).toHaveBeenCalledWith(findAllOptions);
    });

    it('should throw an error if limit is not defined in the query', async () => {
      await request(app.getHttpServer()).get('/users?page=2&filter=test@test.com').expect(400);
    });

    it('should throw an error if one of the parameters is invalid', async () => {
      await request(app.getHttpServer()).get('/users?limit=-5').expect(400);
      await request(app.getHttpServer()).get('/users?limit=101').expect(400); // limit is above maximum value of 100
      await request(app.getHttpServer()).get('/users?page=-5').expect(400);
    });

    it('should throw an error if sort is sent with invalid parameters', async () => {
      await request(app.getHttpServer()).get('/users?sort[name]=invalid').expect(400);
      await request(app.getHttpServer()).get('/users?sort[invalid]=asc').expect(400);
      await request(app.getHttpServer()).get('/users?sort[invalid]=invalid').expect(400);
      await request(app.getHttpServer()).get('/users?sort=name').expect(400);
    });
  });
});
