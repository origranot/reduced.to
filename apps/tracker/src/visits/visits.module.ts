import { Module } from '@nestjs/common';
import { VisitsConsumer } from './visits.consumer';
import { QueueManagerModule, QueueManagerService } from '@reduced.to/queue-manager';
import { PrismaModule } from '@reduced.to/prisma';
import { VisitsService } from './visits.service';

@Module({
  imports: [PrismaModule, QueueManagerModule],
  providers: [VisitsService, VisitsConsumer, QueueManagerService],
  exports: [VisitsService],
})
export class VisitsModule {}
