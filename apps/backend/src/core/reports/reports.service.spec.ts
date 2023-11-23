import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@reduced.to/prisma';
import { SortOrder } from '../../shared/enums/sort-order.enum';
import { IFindAllOptions } from '../entity.service';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            report: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
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
      expect(prismaService.report.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: findAllOptions.limit,
          where: {
            OR: [
              { url: { contains: findAllOptions.filter } },
              { key: { contains: findAllOptions.filter } },
              { reportedBy: { contains: findAllOptions.filter } },
            ],
          },
          skip: findAllOptions.skip,
        })
      );
    });

    it('should not call findMany with skip and filter if not provided', async () => {
      const findAllOptions: IFindAllOptions = { limit: 10 };

      await service.findAll(findAllOptions);
      expect(prismaService.report.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: findAllOptions.limit,
        })
      );
    });

    it('should not call findMany with take and sort', async () => {
      const findAllOptions: IFindAllOptions = { limit: 10, sort: { createdAt: SortOrder.ASCENDING } };

      await service.findAll(findAllOptions);
      expect(prismaService.report.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: findAllOptions.limit,
          orderBy: [
            {
              createdAt: SortOrder.ASCENDING,
            },
          ],
        })
      );
    });
  });
});
