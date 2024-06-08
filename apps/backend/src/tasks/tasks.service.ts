import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UsageService } from '@reduced.to/subscription-manager';

@Injectable()
export class TasksService {
  constructor(private readonly usageService: UsageService) {}

  @Cron('0 0 1 * *') // Runs at midnight on the first day of every month
  async handleCron() {
    await this.usageService.runOnAllActiveUsers(async (user) => {
      await this.usageService.resetUsage(user.id);
    });
  }
}
