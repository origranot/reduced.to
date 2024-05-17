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

  async getClicksOverTime(linkId: string, durationDays = 30): Promise<{ day: string; count: string }[]> {
    const fromDate = sub(new Date(), { days: durationDays });
    const trunc = durationDays === 1 ? 'hour' : 'day';

    return this.prismaService.$queryRaw<{ day: string; count: string }[]>`
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

  async getGroupedByField(
    linkId: string,
    field: string,
    durationDays = 30,
    include?: Record<string, boolean>
  ): Promise<{ field: string; count: string }[]> {
    const fromDate = sub(new Date(), { days: durationDays });

    const includeFields = include
      ? Object.keys(include)
          .map((k) => `"${k}"`)
          .join(', ')
      : '';

    const query = `
      SELECT
        "${field}" AS field,
        ${includeFields ? `${includeFields},` : ''}
        COUNT(*)::text AS count
      FROM
        "Visit"
      WHERE
        "linkId" = $1
        AND "createdAt" >= $2
      GROUP BY
        "${field}" ${includeFields ? `, ${includeFields}` : ''}
      ORDER BY
        COUNT(*) DESC;
    `;

    return this.prismaService.$queryRawUnsafe<{ field: string; count: string }[]>(query, linkId, fromDate);
  }
}
