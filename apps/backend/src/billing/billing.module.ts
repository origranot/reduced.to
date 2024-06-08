import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '@reduced.to/prisma';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { AuthModule } from '../auth/auth.module';
import { UsageModule } from '@reduced.to/subscription-manager';

@Module({
  imports: [forwardRef(() => AuthModule), PrismaModule, UsageModule],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
