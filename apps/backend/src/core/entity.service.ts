import { PrismaService } from '@reduced.to/prisma';
import { IPaginationOptions, IPaginationResult, orderByBuilder } from '../shared/utils';
import { SortOrder } from '../shared/enums/sort-order.enum';
import { filterBuilder } from '../shared/utils';

export abstract class EntityService<Entity> {
  constructor(readonly prismaService: PrismaService) {}

  abstract get model(): string;
  abstract get filterFields(): Record<keyof any, any>;
  abstract get selectFields(): Record<keyof any, boolean>;

  findAll = async (options: IFindAllOptions): Promise<IPaginationResult<Entity>> => {
    const {
      skip,
      limit,
      filter,
      sort,
      status = 'active', // by default get the active links
      maxCreatedAt,
      minCreatedAt,
      extraWhereClause,
      maxExpirationTime,
      minExpirationTime,
    } = options;

    const FILTER_CLAUSE = {};
    const ORDER_BY_CLAUSE = orderByBuilder<Partial<Entity>>(sort as any);

    if (filter) {
      Object.assign(FILTER_CLAUSE, { OR: filterBuilder(this.filterFields, filter) });
    }

    if (status === 'active') {
      Object.assign(FILTER_CLAUSE, { OR: [{ expirationTime: { gt: new Date().toISOString() } }, { expirationTime: null }] });
    } else if (status === 'expired') {
      Object.assign(FILTER_CLAUSE, { expirationTime: { lte: new Date().toISOString() } });
    }
    // Created at filter
    const CREATED_AT_FILTER = {};
    if (maxCreatedAt && minCreatedAt) {
      Object.assign(CREATED_AT_FILTER, { gte: new Date(minCreatedAt).toISOString(), lte: new Date(maxCreatedAt).toISOString() });
    } else if (minCreatedAt) {
      Object.assign(CREATED_AT_FILTER, { gte: new Date(minCreatedAt).toISOString() });
    } else if (maxCreatedAt) {
      Object.assign(CREATED_AT_FILTER, { lte: new Date(maxCreatedAt).toISOString() });
    }

    if (Object.keys(CREATED_AT_FILTER).length > 0) {
      Object.assign(FILTER_CLAUSE, { createdAt: CREATED_AT_FILTER });
    }

    // Expiration date filter
    const EXPIRATION_DATE_FILTER = {};
    if (maxExpirationTime && minExpirationTime) {
      Object.assign(EXPIRATION_DATE_FILTER, {
        gte: new Date(minExpirationTime).toISOString(),
        lte: new Date(maxExpirationTime).toISOString(),
      });
    } else if (minExpirationTime) {
      Object.assign(EXPIRATION_DATE_FILTER, { gte: new Date(minExpirationTime).toISOString() });
    } else if (maxExpirationTime) {
      Object.assign(EXPIRATION_DATE_FILTER, { lte: new Date(maxExpirationTime).toISOString() });
    }

    if (Object.keys(EXPIRATION_DATE_FILTER).length > 0) {
      Object.assign(FILTER_CLAUSE, { expirationTime: EXPIRATION_DATE_FILTER });
    }

    Object.entries(extraWhereClause || {}).forEach(([key, value]) => {
      if (value) {
        Object.assign(FILTER_CLAUSE, { [key]: value });
      }
    });

    const [total, data] = await this.prismaService.$transaction([
      this.prismaService[this.model].count({
        ...((filter || extraWhereClause) && {
          where: FILTER_CLAUSE,
        }),
      }),
      this.prismaService[this.model].findMany({
        select: this.selectFields,
        ...(skip && { skip }),
        take: limit,
        ...((filter || extraWhereClause) && {
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
  minCreatedAt?: string;
  maxCreatedAt?: string;
  minExpirationTime?: string;
  maxExpirationTime?: string;
  sort?: Record<string, SortOrder>;
  status?: string;
  extraWhereClause?: Record<string, any>;
}
