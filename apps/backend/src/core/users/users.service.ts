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

  async findByEmail(email: string): Promise<UserContext> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    delete user?.password;
    delete user?.refreshToken;

    return user;
  }
}
