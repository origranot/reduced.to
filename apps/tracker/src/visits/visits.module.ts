import { Module } from '@nestjs/common';
import { VisitsConsumer } from './visits.consumer';
import { QueueManagerModule, QueueManagerService } from '@reduced.to/queue-manager';
import { PrismaModule } from '@reduced.to/prisma';
import { VisitsService } from './visits.service';
import { UsageModule } from '@reduced.to/subscription-manager';

@Module({
  imports: [PrismaModule, QueueManagerModule, UsageModule],
  providers: [VisitsService, VisitsConsumer, QueueManagerService],
  exports: [VisitsService],
})
export class VisitsModule {}
