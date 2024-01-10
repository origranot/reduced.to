import { Injectable } from '@nestjs/common';
import { Prisma, PrismaService } from '@reduced.to/prisma';

@Injectable()
export class StatsService {
  constructor(private readonly prismaService: PrismaService) {}

  async addVisit(key: string, opts: { hashedIp: string; ua: string; geoLocation: object }) {
    const { hashedIp, ua, geoLocation } = opts;

    try {
      await this.prismaService.visit.create({
        data: {
          ip: hashedIp,
          userAgent: ua,
          geo: geoLocation,
          link: {
            connect: {
              key,
            },
          },
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          // Link record does not exist for the given key (might be a visit to a temporary link)
          return;
        }
      }

      throw err;
    }
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

  async findByURL(key: string) {
    const visits = await this.prismaService.visit.findFirst({
      where: {
        link: {
          key: key,
        },
      }
    });
    return visits; 
  }
}
