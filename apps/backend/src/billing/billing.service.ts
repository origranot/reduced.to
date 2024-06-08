import { Injectable, OnModuleInit } from '@nestjs/common';
import { Plan, PrismaService } from '@reduced.to/prisma';
import { PLAN_LEVELS, UsageService } from '@reduced.to/subscription-manager';
import {
  Environment,
  Paddle,
  SubscriptionActivatedEvent,
  SubscriptionCanceledEvent,
  SubscriptionUpdatedEvent,
} from '@paddle/paddle-node-sdk';
import { AppConfigService } from '@reduced.to/config';
import { AppLoggerService } from '@reduced.to/logger';

@Injectable()
export class BillingService implements OnModuleInit {
  private paddleClient?: Paddle;
  private enabled?: boolean;

  constructor(
    private readonly prisma: PrismaService,
    private readonly appConfigService: AppConfigService,
    private readonly logger: AppLoggerService,
    private readonly usageService: UsageService,
  ) {
    const { paddle, general } = this.appConfigService.getConfig();
    this.enabled = paddle.enable;

    if (!this.enabled) {
      return;
    }

    this.paddleClient = new Paddle(paddle.secret, {
      environment: general.env === 'development' ? Environment.sandbox : Environment.sandbox,
    });
  }

  async onModuleInit() {
    if (!this.enabled) {
      return;
    }

    // Validate paddle plans
    const ids = Object.keys(PLAN_LEVELS)
      .map((plan) => PLAN_LEVELS[plan].PADDLE_PLAN_ID)
      .filter((id) => id !== undefined);
    try {
      for (const id of ids) {
        await this.paddleClient.products.get(id);
      }
    } catch (e) {
      throw new Error('Invalid paddle configuration.');
    }
  }

  verifyWebhookSignature(signature: string, secret: string, payload: string) {
    if (!this.paddleClient) {
      return;
    }

    return this.paddleClient.webhooks.unmarshal(payload, secret, signature);
  }

  async cancelSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.subscription) {
      throw new Error('No subscription found');
    }

    const result = await this.paddleClient.subscriptions.cancel(user.subscription.id, {
      effectiveFrom: 'next_billing_period',
    });

    const endDate = result.currentBillingPeriod.endsAt;

    //Status will be updated in the webhook on cancel
    try {
      await this.prisma.subscription.update({
        where: {
          id: user.subscription.id,
        },
        data: {
          endDate,
          scheduledToBeCancelled: true,
        },
      });
    } catch (e) {
      throw new Error('Failed to cancel subscription');
    }
  }

  async resumeSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.subscription) {
      throw new Error('No subscription found');
    }

    if (!user.subscription.scheduledToBeCancelled) {
      throw new Error('Subscription is not scheduled to be cancelled');
    }

    const result = await this.paddleClient.subscriptions.update(user.subscription.id, {
      scheduledChange: null,
    });

    await this.prisma.subscription.update({
      where: {
        id: user.subscription.id,
      },
      data: {
        endDate: null,
        scheduledToBeCancelled: false,
        status: result.status,
      },
    });
  }

  async updateSubscription(userId: string, newProductId: string, newPriceId: string, operationType: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.subscription) {
      throw new Error('No subscription found');
    }

    const currentPaddleProductId = PLAN_LEVELS[user.subscription.plan].PADDLE_PLAN_ID;
    if (!currentPaddleProductId) {
      throw new Error('Invalid plan');
    }

    if (currentPaddleProductId === newProductId) {
      throw new Error('Same plan selected');
    }

    const newPlan = Object.keys(PLAN_LEVELS).find((plan) => PLAN_LEVELS[plan].PADDLE_PLAN_ID === newProductId);

    if (!newPlan) {
      throw new Error('Invalid plan id');
    }

    const subscriptionUpdate = await this.paddleClient.subscriptions.update(user.subscription.id, {
      items: [{ priceId: newPriceId, quantity: 1 }],
      prorationBillingMode: 'prorated_immediately',
    });

    const newSub = await this.prisma.subscription.update({
      where: {
        id: user.subscription.id,
      },
      data: {
        id: subscriptionUpdate.id,
        plan: Plan[newPlan],
        startDate: subscriptionUpdate.startedAt,
        nextBilledAt: subscriptionUpdate.nextBilledAt,
        status: subscriptionUpdate.status,
      },
    });

    return { ...user, subscription: newSub };
  }

  async onSubscriptionModified(subData: SubscriptionUpdatedEvent) {
    const { id } = subData.data;
    const user = await this.extractUserFromWebhookData(subData.data);

    if (!user) {
      return;
    }

    const mainItem = subData.data.items[0];
    const paddleProductId = mainItem.price.productId;

    let plan = Object.keys(PLAN_LEVELS).find((plan) => PLAN_LEVELS[plan].PADDLE_PLAN_ID === paddleProductId) as Plan;

    if (subData.data.status === 'canceled') {
      plan = Plan.FREE;
      await this.prisma.subscription.delete({
        where: {
          id: id,
        },
      });
    } else {
      await this.prisma.subscription.update({
        where: {
          id: id,
        },
        data: {
          status: subData.data.status,
          plan,
          ...(subData.data.nextBilledAt && { nextBilledAt: new Date(subData.data.nextBilledAt) }),
          startDate: new Date(subData.data.startedAt),
        },
      });
    }

    await this.usageService.updateLimits(user.id, plan);
  }

  async onSubscriptionCancelled(subData: SubscriptionCanceledEvent) {
    const { id } = subData.data;
    const user = await this.extractUserFromWebhookData(subData.data);

    if (!user) {
      return;
    }

    if (user.subscription) {
      await this.prisma.subscription.delete({
        where: {
          id,
        },
      });
    }

    await this.usageService.updateLimits(user.id, Plan.FREE);
  }

  async onSubscriptionAcvivated(subData: SubscriptionActivatedEvent) {
    const user = await this.extractUserFromWebhookData(subData.data);

    if (!user) {
      return;
    }

    const mainItem = subData.data.items[0];
    const paddleProductId = mainItem.price.productId;
    const PLAN_KEY = Object.keys(PLAN_LEVELS).find((plan) => PLAN_LEVELS[plan].PADDLE_PLAN_ID === paddleProductId);
    if (!PLAN_KEY) {
      this.logger.error('Plan not found with id ', paddleProductId, 'subscription =>', subData.data.id);
    }
    const newSubsription = {
      id: subData.data.id,
      userId: user.id,
      plan: PLAN_KEY as Plan,
      startDate: new Date(subData.occurredAt),
      nextBilledAt: new Date(subData.data.nextBilledAt),
      status: subData.data.status,
    };

    try {
      await this.prisma.subscription.upsert({
        where: {
          id: user.subscription?.id || subData.data.id,
        },
        update: {
          id: newSubsription.id,
          plan: newSubsription.plan,
          startDate: newSubsription.startDate,
          nextBilledAt: newSubsription.nextBilledAt,
          status: newSubsription.status,
        },
        create: {
          ...newSubsription,
        },
      });

      await this.usageService.updateLimits(user.id, PLAN_KEY);
    } catch (e) {
      this.logger.error('Failed to create subscription ', e);
    }
  }

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

    const startDate = subscription ? subscription.startDate : user.createdAt;
    const endDate = subscription ? subscription.endDate : null;
    const nextBillingAt = subscription ? subscription.nextBilledAt : null;

    const usage = {
      currentLinkCount: user.usage?.linksCount || 0,
      currentTrackedClicks: user.usage?.clicksCount || 0,
    };

    const limits = {
      linksCount: planConfig.FEATURES.LINKS_COUNT.value,
      trackedClicks: planConfig.FEATURES.TRACKED_CLICKS.value,
    };

    return {
      id: subscription?.id || '',
      plan,
      startDate,
      endDate,
      scheduledToBeCancelled: subscription?.scheduledToBeCancelled || false,
      nextBillingAt,
      limits,
      usage,
    };
  }

  private async extractUserIdFromWebhookData(data: any) {
    const { userId } = data.customData as { userId?: string };
    return userId;
  }

  private async extractUserFromWebhookData(data: any) {
    const userId = await this.extractUserIdFromWebhookData(data);
    if (!userId) {
      return;
    }

    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });
  }
}
