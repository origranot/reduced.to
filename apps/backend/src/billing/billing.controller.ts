import {
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserContext } from '../auth/interfaces/user-context';
import { UserCtx } from '../shared/decorators';
import { AppConfigService } from '@reduced.to/config';
import { Body, Headers } from '@nestjs/common';
import { EventName, SubscriptionActivatedEvent, SubscriptionCanceledEvent, SubscriptionUpdatedEvent } from '@paddle/paddle-node-sdk';
import { Request } from 'express';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { AppLoggerService } from '@reduced.to/logger';
import { AuthService } from '../auth/auth.service';

@Controller('billing')
export class BillingController {
  private webhookSecret?: string;
  constructor(
    private readonly billingService: BillingService,
    private readonly configService: AppConfigService,
    private readonly loggerService: AppLoggerService,
    private readonly authService: AuthService
  ) {
    const { paddle } = this.configService.getConfig();
    this.webhookSecret = paddle.webhookSecret;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/info')
  async getBillingInfo(@UserCtx() user: UserContext) {
    try {
      return await this.billingService.getBillingInfo(user.id);
    } catch (err: unknown) {
      this.loggerService.error(`Could not fetch billing info for user ${user.id}`, err);
      throw new InternalServerErrorException('Could not fetch billing info');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/plan')
  async cancelPlan(@UserCtx() user: UserContext) {
    try {
      await this.billingService.cancelSubscription(user.id);
      return { message: 'Subscription cancelled' };
    } catch (err: unknown) {
      this.loggerService.error(`Could not cancel subscription for user ${user.id}`, err);
      throw new InternalServerErrorException('Could not cancel subscription');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/plan/resume')
  async revertCancellation(@UserCtx() user: UserContext) {
    try {
      await this.billingService.resumeSubscription(user.id);
      return { message: 'Subscription resumed' };
    } catch (err: unknown) {
      this.loggerService.error(`Could not resume subscription for user ${user.id}`, err);
      throw new InternalServerErrorException('Could not resume subscription');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/plan')
  async updatePlan(@UserCtx() user: UserContext, @Body() updatePlanDto: UpdatePlanDto) {
    const { planId, itemId, operationType } = updatePlanDto;

    try {
      const updatedUser = await this.billingService.updateSubscription(user.id, planId, itemId, operationType);
      const tokens = await this.authService.generateTokens(updatedUser);
      return {
        message: 'Plan updated',
        ...tokens,
      };
    } catch (err: unknown) {
      this.loggerService.error(`Could not update subscription for user ${user.id} with planId: ${planId}, priceId: ${itemId}`, err);
      throw new InternalServerErrorException('Could not update subscription');
    }
  }

  @Post('/paddle/webhook')
  async handlePaddleWebhook(@Headers('paddle-signature') signature: string, @Req() req: RawBodyRequest<Request>) {
    if (!this.webhookSecret) {
      throw new NotFoundException();
    }

    const responseText = req.rawBody.toString();
    const parsedEvent = this.billingService.verifyWebhookSignature(signature, this.webhookSecret, responseText);

    if (!parsedEvent) {
      throw new NotFoundException();
    }

    switch (parsedEvent.eventType) {
      case EventName.SubscriptionActivated:
        await this.billingService.onSubscriptionAcvivated(parsedEvent as SubscriptionActivatedEvent);
        break;
      case EventName.SubscriptionCanceled:
        await this.billingService.onSubscriptionCancelled(parsedEvent as SubscriptionCanceledEvent);
        break;
      case EventName.SubscriptionUpdated:
        await this.billingService.onSubscriptionModified(parsedEvent as SubscriptionUpdatedEvent);
        break;
      default:
        break;
    }
  }
}
