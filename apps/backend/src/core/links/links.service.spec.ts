import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@reduced.to/prisma';
import { SortOrder } from '../../shared/enums/sort-order.enum';
import { LinksService } from './links.service';
import { IFindAllOptions } from '../entity.service';

describe('LinksService', () => {
  let service: LinksService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinksService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            link: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<LinksService>(LinksService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Mocking the $transaction method, we don't really care about the result
    jest.spyOn(prismaService, '$transaction').mockResolvedValue([null, null]);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should call findMany with correct parameters without sort', async () => {
      const findAllOptions: IFindAllOptions = {
        skip: 5,
        limit: 10,
        filter: 'test',
        sort: {},
      };

      await service.findAll(findAllOptions);
      expect(prismaService.link.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: findAllOptions.limit,
          where: {
            OR: [{ url: { contains: findAllOptions.filter } }, { key: { contains: findAllOptions.filter } }],
          },
          skip: findAllOptions.skip,
        })
      );
    });

    it('should not call findMany with skip and filter if not provided', async () => {
      const findAllOptions: IFindAllOptions = { limit: 10 };

      await service.findAll(findAllOptions);
      expect(prismaService.link.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: findAllOptions.limit,
        })
      );
    });

    it('should not call findMany with take and sort', async () => {
      const findAllOptions: IFindAllOptions = { limit: 10, sort: { createdAt: SortOrder.ASCENDING, expirationTime: SortOrder.DESCENDING } };

      await service.findAll(findAllOptions);
      expect(prismaService.link.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: findAllOptions.limit,
          orderBy: [
            {
              createdAt: SortOrder.ASCENDING,
            },
            {
              expirationTime: SortOrder.DESCENDING,
            },
          ],
        })
      );
    });

    it('should add extraWhereClause', async () => {
      const findAllOptions: IFindAllOptions = {
        skip: 5,
        limit: 10,
        filter: 'test',
        sort: {},
        extraWhereClause: {
          userId: 'test',
        },
      };

      await service.findAll(findAllOptions);
      expect(prismaService.link.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: findAllOptions.limit,
          where: {
            userId: 'test',
            OR: [{ url: { contains: findAllOptions.filter } }, { key: { contains: findAllOptions.filter } }],
          },
          skip: findAllOptions.skip,
        })
      );
    });
  });
});
