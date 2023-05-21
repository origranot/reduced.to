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
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';

@Controller({
  path: 'shortener',
  version: '1',
})
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @Get(':shortUrl')
  async findOne(@Param('shortUrl') shortUrl: string) {
    const originalUrl = await this.shortenerService.getOriginalUrl(shortUrl);
    if (originalUrl) {
      return originalUrl;
    }
    const premiumUrl = await this.shortenerService.getPremiumUrl(shortUrl);
    if (!premiumUrl) {
      throw new BadRequestException('Short url is wrong or expired');
    }
    return premiumUrl;
  }

  @UseGuards(OptionalJwtGuard)
  @Post()
  async shortener(@Body() body: ShortenerDto, @Req() req: Request) {
    const user = req.user as UserContext;
    const { newUrl } = await this.shortenerService.createShortUrl(body);
    const isUserAuthenticated = !!user?.id;
    if (isUserAuthenticated) {
      return await this.shortenerService.createPremiumUrl(body, user, newUrl);
    }
    return { newUrl, isUserAuthenticated };
  }
}
