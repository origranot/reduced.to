import { Controller, Get, NotFoundException, Param, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { UserCtx } from '../shared/decorators';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserContext } from '../auth/interfaces/user-context';
import { PrismaService } from '@reduced.to/prisma';

@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService, private readonly prismaService: PrismaService) {}

  @Get(':key')
  async getAnalytics(@Param('key') key: string, @Query('days') days: number, @UserCtx() user: UserContext) {
    const link = await this.prismaService.link.findUnique({
      where: { key, userId: user.id },
      select: { id: true, url: true },
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    const data = await this.analyticsService.getClicksOverTime(link.id, days);

    return {
      url: link.url,
      clicksOverTime: data,
    };
  }
}
