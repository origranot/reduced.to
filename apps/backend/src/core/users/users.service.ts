import { Injectable } from '@nestjs/common';
import { EntityService } from '../entity.service';
import { Prisma, PrismaService, User } from '@reduced.to/prisma';

const MODEL_NAME = 'user';
const FILTER_FIELDS: (keyof Prisma.UserWhereInput)[] = ['email', 'name'];
const SELECT_FIELDS: Record<string, boolean> = {
  id: true,
  name: true,
  email: true,
  verified: true,
  createdAt: true,
};

@Injectable()
export class UsersService extends EntityService<User> {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  get model(): string {
    return MODEL_NAME;
  }

  get selectFields(): Record<keyof Prisma.UserWhereInput, boolean> {
    return SELECT_FIELDS;
  }

  get filterFields(): (keyof Prisma.UserWhereInput)[] {
    return FILTER_FIELDS;
  }

  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return this.prismaService.user.count({ where });
  }
}
