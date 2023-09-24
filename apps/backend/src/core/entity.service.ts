import { PrismaService } from '@reduced.to/prisma';
import { IPaginationOptions, IPaginationResult, orderByBuilder } from '../shared/utils';
import { SortOrder } from '../shared/enums/sort-order.enum';
import { filterBuilder } from '../shared/utils/filter/filter';

export abstract class EntityService<Entity> {
  constructor(private readonly prismaService: PrismaService) {}

  abstract get model(): string;
  abstract get filterFields(): string[];

  findAll = async (options: IFindAllOptions): Promise<IPaginationResult<Entity>> => {
    const { skip, limit, filter, sort } = options;

    const FILTER_CLAUSE = { OR: filterBuilder(this.filterFields, filter) };
    const ORDER_BY_CLAUSE = orderByBuilder<Partial<Entity>>(sort as any);

    const [total, data] = await this.prismaService.$transaction([
      this.prismaService[this.model].count({
        ...(filter && {
          where: FILTER_CLAUSE,
        }),
      }),
      this.prismaService[this.model].findMany({
        select: {
          id: true,
          originalUrl: true,
          shortenedUrl: true,
          description: true,
          expirationTime: true,
          createdAt: true,
        },
        ...(skip && { skip }),
        take: limit,
        ...(filter && {
          where: FILTER_CLAUSE,
        }),
        ...(sort && {
          orderBy: ORDER_BY_CLAUSE,
        }),
      }),
    ]);

    return {
      total,
      data,
    };
  };
}

export interface IFindAllOptions extends IPaginationOptions {
  filter?: string;
  sort?: Record<string, SortOrder>;
}
