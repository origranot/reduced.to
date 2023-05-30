import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersController } from './users.controller';
import { UsersService, IFindAllOptions } from './users.service';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AppConfigModule } from '../config/config.module';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('UsersController', () => {
  let app: INestApplication;
  let usersService: UsersService;

  const mockedUsers: Partial<User>[] = [
    { id: '1', name: 'John' },
    { id: '2', name: 'Jane' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockedUsers),
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

    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('should return an array of users without skip when page is not defined', async () => {
      jest.spyOn(usersService, 'findAll').mockResolvedValue(mockedUsers);

      const response = await request(app.getHttpServer()).get('/users?limit=100').expect(200);

      expect(usersService.findAll).toHaveBeenCalledWith({ limit: 100, filter: undefined });
      expect(response.body).toEqual(mockedUsers);
    });

    it('should call findAll with correct parameters and add caluclate skip when page is defined', async () => {
      const findAllOptions: IFindAllOptions = { skip: 10, limit: 10 };

      await request(app.getHttpServer()).get('/users?limit=10&page=2').expect(200);

      expect(usersService.findAll).toHaveBeenCalledWith(findAllOptions);
    });

    it('should call findAll with correct parameters', async () => {
      const findAllOptions: IFindAllOptions = { skip: 10, limit: 10, filter: 'test@test.com' };

      await request(app.getHttpServer()).get('/users?limit=10&page=2&filter=test@test.com').expect(200);

      expect(usersService.findAll).toHaveBeenCalledWith(findAllOptions);
    });

    it('should throw an error if limit is not defined in the query', async () => {
      await request(app.getHttpServer()).get('/users?page=2&filter=test@test.com').expect(400);
    });

    it('should throw an error if one of the parameters is invalid', async () => {
      await request(app.getHttpServer()).get('/users?limit=-5').expect(400); // limit is negative
      await request(app.getHttpServer()).get('/users?limit=101').expect(400); // limit is above maximum value of 100
      await request(app.getHttpServer()).get('/users?page=-5').expect(400); // page is negative
    });
  });
});
