import { Injectable } from '@nestjs/common';
import { Plan, PrismaService } from '@reduced.to/prisma';
import { PLAN_LEVELS } from '@reduced.to/subscription-manager';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async getBillingInfo(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        usage: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const subscription = user.subscription;
    const plan = subscription ? subscription.plan : Plan.FREE;
    const planConfig = PLAN_LEVELS[plan];

    const billingCycle = this.calculateBillingCycle(subscription ? subscription.startDate : user.createdAt);
    const { startDate, nextBillingDate } = billingCycle;

    const usage = {
      currentLinkCount: user.usage?.linksCount || 0,
      currentTrackedClicks: user.usage?.clicksCount || 0,
    };

    const limits = {
      linksCount: planConfig.LINKS_COUNT,
      trackedClicks: planConfig.TRACKED_CLICKS,
    };

    return {
      plan,
      billingCycle: { startDate, nextBillingDate },
      limits,
      usage,
    };
  }

  private calculateBillingCycle(startDate: Date) {
    const now = new Date();
    const currentCycleStartDate = new Date(startDate);

    while (currentCycleStartDate <= now) {
      currentCycleStartDate.setMonth(currentCycleStartDate.getMonth() + 1);
    }

    const nextBillingDate = new Date(currentCycleStartDate);
    currentCycleStartDate.setMonth(currentCycleStartDate.getMonth() - 1);

    return {
      startDate: currentCycleStartDate,
      nextBillingDate,
    };
  }
}
