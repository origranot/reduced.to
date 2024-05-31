import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsageService } from '@reduced.to/subscription-manager';

@Injectable()
export class TasksService {
  constructor(private readonly usageService: UsageService) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleCron() {
    this.usageService.resetUsageForAllUsers();
  }
}
