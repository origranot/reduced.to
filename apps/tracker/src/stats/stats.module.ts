import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsConsumer } from './stats.consumer';
import { QueueManagerModule, QueueManagerService } from '@reduced.to/queue-manager';

@Module({
  imports: [QueueManagerModule],
  providers: [StatsService, StatsConsumer, QueueManagerService],
  exports: [StatsService],
})
export class StatsModule {}
