import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { IPaginationResult, orderByBuilder } from '../shared/utils';
import { SortUserDto } from './dto/sort-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll = async (options: IFindAllOptions): Promise<IPaginationResult<User>> => {
    const { skip, limit, filter, sort } = options;

    const WHERE_CLAUSE = {
      OR: [{ email: { contains: filter } }, { name: { contains: filter } }],
    };

    const ORDER_BY_CLAUSE = orderByBuilder<SortUserDto>(sort as SortUserDto);

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
  sort?: Partial<SortUserDto>;
}
