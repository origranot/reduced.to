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
import { ShortenerDTO, UserShortenerDto } from './dto';
import { ShortenerService } from './shortener.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserContext } from '../auth/interfaces/user-context';

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
    const userUrl = await this.shortenerService.getUserUrl(shortUrl);
    if (!userUrl) {
      throw new BadRequestException('Short url is wrong or expired');
    }
    return originalUrl;
  }

  @Post()
  async shortener(@Body() body: ShortenerDTO) {
    return this.shortenerService.createShortUrl(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('premium')
  async createUserShortUrl(@Body() body: UserShortenerDto, @Req() req: Request) {
    const user = req.user as UserContext;
    return await this.shortenerService.createUserUrl(body, user);
  }
}
