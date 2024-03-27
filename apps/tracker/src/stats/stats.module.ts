import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsConsumer } from './stats.consumer';
import { QueueManagerModule, QueueManagerService } from '@rt/queue-manager';
import { PrismaModule } from '@rt/prisma';

@Module({
  imports: [PrismaModule, QueueManagerModule],
  providers: [StatsService, StatsConsumer, QueueManagerService],
  exports: [StatsService],
})
export class StatsModule {}
