import { BadRequestException, Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ShortenerDto } from './dto';
import { ShortenerService } from './shortener.service';
import { UserContext } from '../auth/interfaces/user-context';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { AppLoggerSerivce } from '@reduced.to/logger';
import { ShortenerProducer } from './producer/shortener.producer';
import { ClientDetails, IClientDetails } from '../shared/decorators/client-details/client-details.decorator';

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

    // Send an event to the queue to update the shortened url's stats
    await this.shortenerProducer.publish({
      ...clientDetails,
      key,
      url,
    });

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
      throw new BadRequestException('You must be veirifed in to create a shortened url');
    }

    this.logger.log(`User ${user.id} is creating a shortened url for ${shortenerDto.url}`);
    return this.shortenerService.createUsersShortenedUrl(user, shortenerDto);
  }
}
