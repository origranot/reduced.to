import { UrlsService } from './urls.service';
import { Body, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UpdateUrlDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../shared/decorators/user-data/user';
import { Url } from '@prisma/client';

@UseGuards(JwtAuthGuard)
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Put(':urlId')
  async updateUrl(@Body() updateUrl: UpdateUrlDto, @Param('urlId') urlId: string): Promise<Url> {
    return this.urlsService.updateUrl(updateUrl, urlId);
  }

  @Get()
  async getUrls(@User('id') userId: string): Promise<Url[]> {
    return this.urlsService.getUrls(userId);
  }

  @Delete(':urlId')
  async deleteUrl(@Param('urlId') urlId: string): Promise<Url> {
    return this.urlsService.deleteUrl(urlId);
  }
}
