import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '@reduced.to/logger';
import { PrismaService } from '@reduced.to/prisma';
import { sub } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(private readonly logger: AppLoggerService, private readonly prismaService: PrismaService) {}

  async getTotalVisits(key: string, userId: string): Promise<number> {
    return this.prismaService.visit.count({
      where: {
        link: {
          key,
          userId,
        },
      },
    });
  }

  async getClicksOverTime(linkId: string, durationDays = 30): Promise<any[]> {
    const fromDate = sub(new Date(), { days: durationDays });
    const trunc = durationDays === 1 ? 'min' : 'day';

    return this.prismaService.$queryRaw`
      SELECT
        date_trunc(${trunc}, "createdAt")::text AS day,
        COUNT(*)::text AS count
      FROM
        "Visit"
      WHERE
        "linkId" = ${linkId}
        AND "createdAt" >= ${fromDate}
      GROUP BY
        day
      ORDER BY
        day;
    `;
  }
}
