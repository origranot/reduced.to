import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ShortenerDto } from './dto';
import { ShortenerService } from './shortener.service';
import { UserContext } from '../auth/interfaces/user-context';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@Controller({
  path: 'shortener',
  version: '1',
})
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @Get(':shortenedUrl')
  async findOne(@Param('shortenedUrl') shortenedUrl: string) {
    const originalUrl = await this.shortenerService.getOriginalUrl(shortenedUrl);
    if (!originalUrl) {
      throw new BadRequestException('Shortened url is wrong or expired');
    }
    return originalUrl;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async shortener(@Body() body: ShortenerDto, @Req() req: Request) {
    const user = req.user as UserContext;
    const { newUrl } = await this.shortenerService.createShortUrl(body);
    const isUserAuthenticated = !!user?.id;
    if (isUserAuthenticated) {
      await this.shortenerService.createDbUrl(body, user, newUrl);
    }
    return { newUrl };
  }
}
