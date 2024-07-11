import { Module } from '@nestjs/common';
import { UsageModule } from '@reduced.to/subscription-manager';
import { TasksService } from './tasks.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), UsageModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
