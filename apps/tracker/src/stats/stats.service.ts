import { Injectable } from '@nestjs/common';
import { PrismaService } from '@reduced.to/prisma';

@Injectable()
export class StatsService {
  constructor(private readonly prismaService: PrismaService) {}

  async addVisit(key: string, opts: { hashedIp: string; ua: string; geo: object }) {
    const { hashedIp, ua, geo } = opts;

    return this.prismaService.visit.create({
      data: {
        ip: hashedIp,
        userAgent: ua,
        ...(geo && { geo }),
        link: {
          connect: {
            key,
          },
        },
      },
    });
  }

  async isUniqueVisit(key: string, hashedIp: string) {
    const visit = await this.prismaService.visit.findFirst({
      where: {
        ip: hashedIp,
        link: {
          key: key,
        },
      },
    });

    return visit === null;
  }
}
