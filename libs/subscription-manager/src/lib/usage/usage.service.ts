import { Injectable } from '@nestjs/common';
import { PrismaService } from '@reduced.to/prisma';

@Injectable()
export class UsageService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsage(userId: string) {
    return this.prismaService.usage.findUnique({
      where: { userId },
    });
  }

  async resetUsageForAllUsers() {
    return this.prismaService.user.findMany({
      include: {
        subscription: true,
        usage: true,
      },
    });
  }

  async incrementClicksCount(userId: string) {
    return this.prismaService.usage.update({
      where: { userId },
      data: { clicksCount: { increment: 1 } },
    });
  }

  async incrementLinksCount(userId: string) {
    return this.prismaService.usage.update({
      where: { userId },
      data: { linksCount: { increment: 1 } },
    });
  }

  async decreaseLinksCount(userId: string) {
    return this.prismaService.usage.update({
      where: { userId },
      data: { linksCount: { decrement: 1 } },
    });
  }

  async isEligibleToCreateLink(userId: string) {
    const usage = await this.getUsage(userId);

    if (!usage) {
      return false;
    }

    return usage.linksCount < usage.linksLimit;
  }

  async isEligibleToTrackClicks(userId: string) {
    const usage = await this.getUsage(userId);

    if (!usage) {
      return false;
    }

    return usage.clicksCount < usage.clicksLimit;
  }
}
