import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll = async (options: IFindAllOptions): Promise<Partial<User>[]> => {
    const { skip, limit, filter } = options;

    return this.prismaService.user.findMany({
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
        where: {
          OR: [{ email: { contains: filter } }, { name: { contains: filter } }],
        },
      }),
    });
  };
}

export interface IFindAllOptions {
  skip?: number;
  limit: number;
  filter?: string;
}
