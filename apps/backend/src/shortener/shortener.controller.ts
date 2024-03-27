import { BadRequestException, Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ShortenerDto } from '@rt/backend/shortener/dto';
import { ShortenerService } from '@rt/backend/shortener/shortener.service';
import { UserContext } from '@rt/backend/auth/interfaces/user-context';
import { OptionalJwtAuthGuard } from '@rt/backend/auth/guards/optional-jwt-auth.guard';
import { AppLoggerSerivce } from '@rt/logger';
import { ShortenerProducer } from '@rt/backend/shortener/producer/shortener.producer';
import { ClientDetails, IClientDetails } from '@rt/backend/shared/decorators/client-details/client-details.decorator';

@Controller({
  path: 'shortener',
  version: '1',
})
export class ShortenerController {
  constructor(
    private readonly logger: AppLoggerSerivce,
    private readonly shortenerService: ShortenerService,
    private readonly shortenerProducer: ShortenerProducer
  ) {}

  @Get(':key')
  async findOne(@ClientDetails() clientDetails: IClientDetails, @Param('key') key: string): Promise<string> {
    const url = await this.shortenerService.getUrl(key);
    if (!url) {
      throw new BadRequestException('Shortened url is wrong or expired');
    }

    try {
      await this.shortenerProducer.publish({
        ...clientDetails,
        key,
        url,
      });
    } catch (err) {
      this.logger.error(`Error while publishing shortened url: ${err.message}`);
    }

    return url;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async shortener(@Body() shortenerDto: ShortenerDto, @Req() req: Request): Promise<{ key: string }> {
    const user = req.user as UserContext;

    if (shortenerDto.temporary) {
      return this.shortenerService.createShortenedUrl(shortenerDto.url);
    }

    // Only verified users can create shortened urls
    if (!user?.verified) {
      throw new BadRequestException('You must be verified in to create a shortened url');
    }

    this.logger.log(`User ${user.id} is creating a shortened url for ${shortenerDto.url}`);
    return this.shortenerService.createUsersShortenedUrl(user, shortenerDto);
  }
}
