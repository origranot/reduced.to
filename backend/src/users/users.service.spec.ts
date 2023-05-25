import { Test, TestingModule } from '@nestjs/testing';
import { IFindAllOptions, UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('should call findMany with correct parameters', async () => {
      const findAllOptions: IFindAllOptions = { skip: 5, limit: 10, filter: 'test' };

      await service.findAll(findAllOptions);
      expect(prismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: findAllOptions.limit,
          where: {
            OR: [{ email: { contains: findAllOptions.filter } }, { name: { contains: findAllOptions.filter } }],
          },
          skip: findAllOptions.skip,
        })
      );
    });

    it('should not call findMany with skip and filter if not provided', async () => {
      const findAllOptions: IFindAllOptions = { limit: 10 };

      await service.findAll(findAllOptions);
      expect(prismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: findAllOptions.limit,
        })
      );
    });
  });
});
