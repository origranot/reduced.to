import { Injectable } from '@nestjs/common';
import { EntityService } from '../entity.service';
import { Prisma, PrismaService, Report } from '@reduced.to/prisma';
import { AppConfigService } from '@reduced.to/config';

const MODEL_NAME = 'report';
const FILTER_FIELDS: (keyof Prisma.ReportWhereInput)[] = ['url', 'key', 'category'];
const SELECT_FIELDS: Partial<Record<keyof Prisma.ReportWhereInput, boolean>> = {
  id: true,
  url: true,
  key: true,
  category: true,
  createdAt: true,
};

@Injectable()
export class ReportsService extends EntityService<Report> {
  constructor(private readonly config: AppConfigService, prismaService: PrismaService) {
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

  create({ key, url, category }: { key: string; url: string; category: string }): Promise<Report> {
    return this.prismaService.report.create({
      data: {
        key,
        url,
        category,
      },
    });
  }

  delete(id: string): Promise<Report> {
    return this.prismaService.report.delete({
      where: {
        id,
      },
    });
  }

  isUrlReportable(url: string): boolean {
    const domain = this.config.getConfig().front.domain.replace(/\./g, '\\.');
    const regexPattern = new RegExp(`^https?:\/\/${domain}\/[\\w\\-\\.]+$`);

    return regexPattern.test(url);
  }
}
