import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsConsumer } from './stats.consumer';
import { QueueManagerModule, QueueManagerService } from '@reduced.to/queue-manager';
import { PrismaModule } from '@reduced.to/prisma';

@Module({
  imports: [PrismaModule, QueueManagerModule],
  providers: [StatsService, StatsConsumer, QueueManagerService],
  exports: [StatsService],
})
export class StatsModule {}
