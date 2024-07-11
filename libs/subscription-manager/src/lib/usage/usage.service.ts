import { Injectable } from '@nestjs/common';
import { PrismaService } from '@reduced.to/prisma';
import { PLAN_LEVELS } from '../limits';

@Injectable()
export class UsageService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsage(userId: string) {
    return this.prismaService.usage.findUnique({
      where: { userId },
    });
  }

  async updateLimits(userId: string, plan: string) {
    const planConfig = PLAN_LEVELS[plan] || PLAN_LEVELS.FREE;
    return this.prismaService.usage.update({
      where: { userId },
      data: {
        clicksLimit: planConfig.FEATURES.TRACKED_CLICKS.value,
        linksLimit: planConfig.FEATURES.LINKS_COUNT.value,
      },
    });
  }

  async resetUsage(userIds: string[]) {
    return this.prismaService.usage.updateMany({
      where: {
        userId: { in: userIds },
      },
      data: {
        clicksCount: 0,
        linksCount: 0,
      },
    });
  }

  async runOnAllActiveUsers(batchSize: number, callback: (userIds: string[]) => Promise<void>): Promise<void> {
    let page = 1;
    let hasMoreUsers = true;

    while (hasMoreUsers) {
      try {
        const users = await this.prismaService.user.findMany({
          where: {
            verified: true,
          },
          select: {
            id: true,
          },
          skip: (page - 1) * batchSize,
          take: batchSize,
        });

        if (users.length === 0) {
          hasMoreUsers = false;
          break;
        }

        const userIds = users.map((user) => user.id);
        await callback(userIds);

        page++;
      } catch (error) {
        console.error('Error fetching users:', error);
        break;
      }
    }
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
