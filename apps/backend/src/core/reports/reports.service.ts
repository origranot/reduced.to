import { Injectable } from '@nestjs/common';
import { EntityService } from '@rt/backend/core/entity.service';
import { Prisma, PrismaService, Report } from '@rt/prisma';
import { AppConfigService } from '@rt/config';

@Injectable()
export class ReportsService extends EntityService<Report> {
  constructor(private readonly config: AppConfigService, prismaService: PrismaService) {
    super(prismaService);
  }

  get model(): string {
    return 'report';
  }

  get selectFields(): Partial<Record<keyof Prisma.ReportWhereInput, any | boolean>> {
    return {
      id: true,
      link: {
        select: {
          url: true,
          key: true,
        },
      },
      category: true,
      createdAt: true,
    };
  }

  get filterFields(): Partial<Record<keyof Prisma.ReportWhereInput, any | boolean>> {
    return {
      link: {
        key: true,
        url: true,
      },
      category: true,
    };
  }

  create({ key, category }: { key: string; category: string }): Promise<Report> {
    return this.prismaService.report.create({
      data: {
        link: {
          connect: {
            key,
          },
        },
        category,
      },
    });
  }

  findById(id: string) {
    return this.prismaService.report.findUnique({
      where: {
        id,
      },
      include: {
        link: true,
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
    // eslint-disable-next-line no-useless-escape
    const regexPattern = new RegExp(`^https?:\/\/${domain}\/[\\w\\-\\.]+$`);

    return regexPattern.test(url);
  }
}
