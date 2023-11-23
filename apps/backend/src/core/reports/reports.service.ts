import { Injectable } from '@nestjs/common';
import { EntityService } from '../entity.service';
import { Prisma, PrismaService } from '@reduced.to/prisma';

const MODEL_NAME = 'report';
const FILTER_FIELDS: (keyof Prisma.ReportWhereInput)[] = ['url', 'key', 'reportedBy'];
const SELECT_FIELDS: Partial<Record<keyof Prisma.ReportWhereInput, boolean>> = {
  id: true,
  url: true,
  key: true,
  description: true,
  reportedBy: true,
  createdAt: true,
};

@Injectable()
export class ReportsService extends EntityService<Report> {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  get model(): string {
    return MODEL_NAME;
  }

  get selectFields(): Partial<Record<keyof Prisma.ReportWhereInput, boolean>> {
    return SELECT_FIELDS;
  }

  get filterFields(): (keyof Prisma.ReportWhereInput)[] {
    return FILTER_FIELDS;
  }
}
