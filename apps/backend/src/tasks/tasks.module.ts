import { Module } from '@nestjs/common';
import { UsageModule } from '@reduced.to/subscription-manager';
import { TasksService } from './tasks.service';

@Module({
  imports: [UsageModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
