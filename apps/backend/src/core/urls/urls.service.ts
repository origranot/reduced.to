import { Injectable } from '@nestjs/common';
import { EntityService } from '../entity.service';
import { Url, Prisma, PrismaService } from '@reduced.to/prisma';

const MODEL_NAME = 'url';
const FILTER_FIELDS: (keyof Prisma.UrlWhereInput)[] = ['originalUrl', 'shortenedUrl'];

@Injectable()
export class UrlsService extends EntityService<Url> {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  get model(): string {
    return MODEL_NAME;
  }

  get filterFields(): (keyof Prisma.UrlWhereInput)[] {
    return FILTER_FIELDS;
  }
}
