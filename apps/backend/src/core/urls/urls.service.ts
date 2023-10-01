import { Injectable } from '@nestjs/common';
import { EntityService } from '../entity.service';
import { Url, Prisma, PrismaService } from '@reduced.to/prisma';

const MODEL_NAME = 'url';
const FILTER_FIELDS: (keyof Prisma.UrlWhereInput)[] = ['originalUrl', 'shortenedUrl'];
const SELECT_FIELDS: Record<string, boolean> = {
  id: true,
  originalUrl: true,
  shortenedUrl: true,
  description: true,
  expirationTime: true,
  createdAt: true,
};

@Injectable()
export class UrlsService extends EntityService<Url> {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  get model(): string {
    return MODEL_NAME;
  }

  get selectFields(): Record<keyof Prisma.UserWhereInput, boolean> {
    return SELECT_FIELDS;
  }

  get filterFields(): (keyof Prisma.UrlWhereInput)[] {
    return FILTER_FIELDS;
  }
}
