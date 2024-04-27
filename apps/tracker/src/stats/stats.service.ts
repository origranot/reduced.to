import { Injectable } from '@nestjs/common';
import { PrismaService } from '@reduced.to/prisma';

@Injectable()
export class StatsService {
  constructor(private readonly prismaService: PrismaService) {}

  async addVisit(key: string, opts: { hashedIp: string; ua: string; geoLocation: object }) {
    const { hashedIp, ua, geoLocation } = opts;

    return this.prismaService.$transaction(async (prisma) => {
      const linkExists = await prisma.link.findUnique({
        where: { key },
        select: { id: true },
      });

      if (!linkExists) return; // Early return if link does not exist

      await prisma.visit.create({
        data: {
          ip: hashedIp,
          userAgent: ua,
          geo: geoLocation,
          link: { connect: { key } },
        },
      });

      await prisma.link.update({
        where: { key },
        data: { clicks: { increment: 1 } },
      });
    });
  }

  async isUniqueVisit(key: string, hashedIp: string): Promise<boolean> {
    const count = await this.prismaService.visit.count({
      where: {
        ip: hashedIp,
        link: { key },
      },
    });

    return count === 0;
  }
}
