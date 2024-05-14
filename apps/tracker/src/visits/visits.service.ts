import { Injectable } from '@nestjs/common';
import { PrismaService } from '@reduced.to/prisma';
import uap from 'ua-parser-js';
import geoip from 'geoip-lite';
import { capitalize, setToIfUndefined } from '@reduced.to/utils';

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
          country: setToIfUndefined(geoLocation?.country, null),
          region: setToIfUndefined(geoLocation?.region, null),
          city: setToIfUndefined(geoLocation?.city, null),
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
      browser: setToIfUndefined(parsed.browser.name, null),
      os: setToIfUndefined(parsed.os.name, null),
      device: setToIfUndefined(
        parsed.device.type === undefined || parsed.device.type !== 'mobile' ? 'Desktop' : capitalize(parsed.device.type),
        null
      ),
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
