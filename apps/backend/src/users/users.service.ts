import { Injectable } from '@nestjs/common';
import { PrismaService } from '@reduced.to/prisma';
import { User } from '@reduced.to/prisma';
import { IPaginationResult, orderByBuilder } from '../shared/utils';
import { SortOrder } from '../shared/enums/sort-order.enum';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll = async (options: IFindAllOptions): Promise<IPaginationResult<User>> => {
    const { skip, limit, filter, sort } = options;

    const WHERE_CLAUSE = {
      OR: [{ email: { contains: filter } }, { name: { contains: filter } }],
    };

    const ORDER_BY_CLAUSE = orderByBuilder<Partial<User>>(sort);

    const [total, data] = await this.prismaService.$transaction([
      this.prismaService.user.count({
        ...(filter && {
          where: WHERE_CLAUSE,
        }),
      }),
      this.prismaService.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          verified: true,
        },
        ...(skip && { skip }),
        take: limit,
        ...(filter && {
          where: WHERE_CLAUSE,
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

export interface IFindAllOptions {
  skip?: number;
  limit: number;
  filter?: string;
  sort?: Record<string, SortOrder>;
}
