import { Injectable } from '@nestjs/common';
import { EntityService } from '../entity.service';
import { Prisma, PrismaService, User } from '@reduced.to/prisma';
import { UserContext } from '../../auth/interfaces/user-context';

@Injectable()
export class UsersService extends EntityService<User> {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  get model(): string {
    return 'user';
  }

  get selectFields(): Partial<Record<keyof Prisma.UserWhereInput, boolean>> {
    return {
      id: true,
      name: true,
      email: true,
      verified: true,
      createdAt: true,
    };
  }

  get filterFields(): Partial<Record<keyof Prisma.UserWhereInput, boolean>> {
    return {
      email: true,
      name: true,
    };
  }

  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return this.prismaService.user.count({ where });
  }

  async findUserContextByEmail(email: string): Promise<UserContext> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        subscription: true,
      },
    });

    // We want to return undefined if user is not found
    if (!user) {
      return undefined;
    }

    delete user?.password;
    delete user?.refreshToken;

    return {
      ...user,
      plan: user?.subscription?.plan || 'FREE',
    };
  }

  async updateById(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data,
    });
  }
}
