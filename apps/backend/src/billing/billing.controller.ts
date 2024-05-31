import { Controller, Get, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserContext } from '../auth/interfaces/user-context';
import { UserCtx } from '../shared/decorators';

@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('/info')
  async getBillingInfo(@UserCtx() user: UserContext) {
    return this.billingService.getBillingInfo(user.id);
  }
}
