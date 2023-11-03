import { Injectable } from '@nestjs/common';
import { EntityService } from '../entity.service';
import { Link, Prisma, PrismaService } from '@reduced.to/prisma';

const MODEL_NAME = 'link';
const FILTER_FIELDS: (keyof Prisma.LinkWhereInput)[] = ['url', 'key'];
const SELECT_FIELDS: Partial<Record<keyof Prisma.LinkWhereInput, boolean>> = {
  id: true,
  url: true,
  key: true,
  description: true,
  expirationTime: true,
  createdAt: true,
};

@Injectable()
export class LinksService extends EntityService<Link> {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  get model(): string {
    return MODEL_NAME;
  }

  get selectFields(): Partial<Record<keyof Prisma.LinkWhereInput, boolean>> {
    return SELECT_FIELDS;
  }

  get filterFields(): (keyof Prisma.LinkWhereInput)[] {
    return FILTER_FIELDS;
  }
}
