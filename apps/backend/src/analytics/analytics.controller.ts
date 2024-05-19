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
    const link = await this.findLink(key, user.id);
    const data = await this.analyticsService.getClicksOverTime(link.id, days);
    return { url: link.url, clicksOverTime: data };
  }

  @Get(':key/devices')
  async getDevices(@Param('key') key: string, @Query('days') days: number, @UserCtx() user: UserContext) {
    return this.getGroupedData(key, user.id, days, 'device');
  }

  @Get(':key/os')
  async getOs(@Param('key') key: string, @Query('days') days: number, @UserCtx() user: UserContext) {
    return this.getGroupedData(key, user.id, days, 'os');
  }

  @Get(':key/browsers')
  async getBrowsers(@Param('key') key: string, @Query('days') days: number, @UserCtx() user: UserContext) {
    return this.getGroupedData(key, user.id, days, 'browser');
  }

  @Get(':key/countries')
  async getCountries(@Param('key') key: string, @Query('days') days: number, @UserCtx() user: UserContext) {
    return this.getGroupedData(key, user.id, days, 'country');
  }

  @Get(':key/regions')
  async getRegions(@Param('key') key: string, @Query('days') days: number, @UserCtx() user: UserContext) {
    return this.getGroupedData(key, user.id, days, 'region');
  }

  @Get(':key/cities')
  async getCities(@Param('key') key: string, @Query('days') days: number, @UserCtx() user: UserContext) {
    return this.getGroupedData(key, user.id, days, 'city', {
      country: true,
    });
  }

  private async findLink(key: string, userId: string) {
    const link = await this.prismaService.link.findUnique({
      where: { key, userId },
      select: { id: true, url: true },
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    return link;
  }

  private async getGroupedData(key: string, userId: string, days: number, field: string, include?: Record<string, boolean>) {
    const link = await this.findLink(key, userId);
    const data = await this.analyticsService.getGroupedByField(link.id, field, days, include);
    return { url: link.url, data };
  }
}
