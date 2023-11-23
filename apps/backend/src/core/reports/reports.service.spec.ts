import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@reduced.to/prisma';
import { SortOrder } from '../../shared/enums/sort-order.enum';
import { IFindAllOptions } from '../entity.service';
import { ReportsService } from './reports.service';
import { AppConfigService } from '@reduced.to/config';

const MOCK_CONFIG = {
  front: {
    domain: 'reduced.to',
  },
};

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
              create: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: AppConfigService,
          useValue: {
            getConfig: jest.fn().mockReturnValue(MOCK_CONFIG),
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
              { category: { contains: findAllOptions.filter } },
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

  describe('create', () => {
    it('should call create with correct parameters', async () => {
      const createOptions = {
        key: 'test',
        url: 'https://reduced.to/test',
        category: 'test',
      };

      await service.create(createOptions);
      expect(prismaService.report.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: createOptions,
        })
      );
    });
  });

  describe('isUrlReportable', () => {
    const TEST_CASES = [
      ['https://reduced.to/123', true],
      ['https://reduced.to/some_cool_key', true],
      ['https://reduced.to/abcass', true],
      ['https://reduced.to/orig', true],
      ['http://reduced.to/123', true],
      ['http://reduced.to/orig', true],
      ['http://reduced.to/some_cool_key', true],
      ['https://not_reduced.to/123', false],
      ['http://not_reduced.to/some_cool_key', false],
      ['https://not_reduced.to/some_cool_key', false],
      ['https://reduced.to/sfafaf/', false],
      ['reduced.to/123', false],
      ['google.com', false],
      ['https://google.com', false],
      ['https://reduced.to/123/456', false],
      ['https://reduced.to/123/456/789', false],
      ['https://test.com', false],
      ['https://reduced.to', false],
      ['https://reduced.to/', false],
      ['https://reduced.to/123/456/789/1011', false],
      ['https://reduced.to/123///', false],
    ];

    it.each(TEST_CASES)('should return false if url "%s" is not reportable', (url: string, expectedResult: boolean) => {
      expect(service.isUrlReportable(url)).toBe(expectedResult);
    });
  });

  describe('delete', () => {
    it('should call delete with correct parameters', async () => {
      const id = 'test';

      await service.delete(id);
      expect(prismaService.report.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id,
          },
        })
      );
    });
  });
});
