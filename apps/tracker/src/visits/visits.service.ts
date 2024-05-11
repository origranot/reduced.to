import { Injectable } from '@nestjs/common';
import { PrismaService } from '@reduced.to/prisma';
import uap from 'ua-parser-js';
import geoip from 'geoip-lite';

@Injectable()
export class VisitsService {
  constructor(private readonly prismaService: PrismaService) {}

  async add(key: string, opts: { hashedIp: string; ua: string; geoLocation: geoip.Lookup }) {
    const { hashedIp, ua, geoLocation } = opts;

    return this.prismaService.$transaction(async (prisma) => {
      const linkExists = await prisma.link.findUnique({
        where: { key },
        select: { id: true },
      });

      if (!linkExists) return; // Early return if link does not exist

      const { browser, os, device } = await this.parseUa(ua);

      await prisma.visit.create({
        data: {
          ip: hashedIp,
          userAgent: ua,
          browser,
          os,
          device,
          geo: geoLocation as object,
          country: geoLocation?.country,
          region: geoLocation?.region,
          city: geoLocation?.city,
          link: { connect: { key } },
        },
      });

      await prisma.link.update({
        where: { key },
        data: { clicks: { increment: 1 } },
      });
    });
  }

  async parseUa(ua: string): Promise<{ browser: string; os: string; device: string }> {
    const parsed = uap(ua);

    return {
      browser: `${parsed.browser.name} ${parsed.browser.version}`,
      os: `${parsed.os.name} ${parsed.os.version}`,
      device: `${parsed.device.vendor} ${parsed.device.model}`,
    };
  }

  async isUnique(key: string, hashedIp: string): Promise<boolean> {
    const count = await this.prismaService.visit.count({
      where: {
        ip: hashedIp,
        link: { key },
      },
    });

    return count === 0;
  }
}
