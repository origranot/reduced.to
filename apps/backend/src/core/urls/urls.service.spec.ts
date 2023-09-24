import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@reduced.to/prisma';
import { SortOrder } from '../../shared/enums/sort-order.enum';
import { UrlsService } from './urls.service';
import { IFindAllOptions } from '../entity.service';

describe('UrlsService', () => {
  let service: UrlsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            url: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
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
      expect(prismaService.url.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: findAllOptions.limit,
          where: {
            OR: [{ originalUrl: { contains: findAllOptions.filter } }, { shortenedUrl: { contains: findAllOptions.filter } }],
          },
          skip: findAllOptions.skip,
        })
      );
    });

    it('should not call findMany with skip and filter if not provided', async () => {
      const findAllOptions: IFindAllOptions = { limit: 10 };

      await service.findAll(findAllOptions);
      expect(prismaService.url.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: findAllOptions.limit,
        })
      );
    });

    it('should not call findMany with take and sort', async () => {
      const findAllOptions: IFindAllOptions = { limit: 10, sort: { name: SortOrder.ASCENDING, email: SortOrder.DESCENDING } };

      await service.findAll(findAllOptions);
      expect(prismaService.url.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: findAllOptions.limit,
          orderBy: [
            {
              name: SortOrder.ASCENDING,
            },
            {
              email: SortOrder.DESCENDING,
            },
          ],
        })
      );
    });
  });
});
