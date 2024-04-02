import { BadRequestException, Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ShortenerDto } from './dto';
import { ShortenerService } from './shortener.service';
import { UserContext } from '../auth/interfaces/user-context';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { AppLoggerSerivce } from '@reduced.to/logger';
import { ShortenerProducer } from './producer/shortener.producer';
import { ClientDetails, IClientDetails } from '../shared/decorators/client-details/client-details.decorator';
import { SafeUrlService } from '@reduced.to/safe-url';

@Controller({
  path: 'shortener',
  version: '1',
})
export class ShortenerController {
  constructor(
    private readonly logger: AppLoggerSerivce,
    private readonly shortenerService: ShortenerService,
    private readonly shortenerProducer: ShortenerProducer,
    private readonly safeUrlService: SafeUrlService
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

    // Check if the url is safe
    const isSafeUrl = await this.safeUrlService.isSafeUrl(shortenerDto.url);
    if (!isSafeUrl) {
      throw new BadRequestException('This url is not safe to shorten!');
    }

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
