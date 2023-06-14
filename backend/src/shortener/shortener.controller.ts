import { BadRequestException, Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ShortenerDto } from './dto';
import { ShortenerService } from './shortener.service';
import { UserContext } from '../auth/interfaces/user-context';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { AppLoggerSerivce } from '../logger/logger.service';
import { AnalyticsService } from './services/analytics/analytics.service';

@Controller({
  path: 'shortener',
  version: '1',
})
export class ShortenerController {
  constructor(
    private readonly logger: AppLoggerSerivce,
    private readonly shortenerService: ShortenerService,
    private readonly analyticsService: AnalyticsService
  ) {}

  @Get(':shortenedUrl')
  async findOne(@Req() req: Request, @Param('shortenedUrl') shortenedUrl: string): Promise<string> {
    const originalUrl = await this.shortenerService.getOriginalUrl(shortenedUrl);
    if (!originalUrl) {
      throw new BadRequestException('Shortened url is wrong or expired');
    }

    await this.analyticsService.trackRequest(req, shortenedUrl);

    return originalUrl;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async shortener(@Body() shortenerDto: ShortenerDto, @Req() req: Request): Promise<{ newUrl: string }> {
    const user = req.user as UserContext;

    // Only verified users can create shortened urls into the database (otherwise, they are stored in the cache)
    if (user?.verified) {
      this.logger.log(`User ${user.id} is creating a shortened url for ${shortenerDto.originalUrl}`);
      return this.shortenerService.createUsersShortenedUrl(user, shortenerDto);
    }

    return this.shortenerService.createShortenedUrl(shortenerDto.originalUrl);
  }
}
