import { Injectable } from '@nestjs/common';
import { EntityService } from '../entity.service';
import { Prisma, PrismaService, User } from '@reduced.to/prisma';

const MODEL_NAME = 'user';
const FILTER_FIELDS: (keyof Prisma.UserWhereInput)[] = ['email', 'name'];

@Injectable()
export class UsersService extends EntityService<User> {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  get model(): string {
    return MODEL_NAME;
  }

  get filterFields(): (keyof Prisma.UserWhereInput)[] {
    return FILTER_FIELDS;
  }
}
