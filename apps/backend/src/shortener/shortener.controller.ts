import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ShortenerDto } from './dto';
import { ShortenerService } from './shortener.service';
import { UserContext } from '../auth/interfaces/user-context';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { AppLoggerService } from '@reduced.to/logger';
import { ShortenerProducer } from './producer/shortener.producer';
import { ClientDetails, IClientDetails } from '../shared/decorators/client-details/client-details.decorator';
import { SafeUrlService } from '@reduced.to/safe-url';
import { AppConfigService } from '@reduced.to/config';
import { Link } from '@prisma/client';
import { addUtmParams } from '@reduced.to/utils';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

interface LinkResponse extends Partial<Link> {
  url: string;
  key: string;
}

@Controller({
  path: 'shortener',
  version: '1',
})
export class ShortenerController {
  constructor(
    private readonly configService: AppConfigService,
    private readonly logger: AppLoggerService,
    private readonly shortenerService: ShortenerService,
    private readonly shortenerProducer: ShortenerProducer,
    private readonly safeUrlService: SafeUrlService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('random')
  async random(): Promise<string> {
    return this.shortenerService.createRandomShortenedUrl();
  }

  @Get(':key')
  async findOne(
    @ClientDetails() clientDetails: IClientDetails,
    @Param('key') key: string,
    @Query('pw') password = '' // Add optional password query parameter
  ): Promise<LinkResponse> {
    const data = await this.shortenerService.getLink(key);

    if (!data) {
      throw new BadRequestException('Shortened url is wrong or expired');
    }

    if (data.password && (await this.shortenerService.verifyPassword(data.password, password)) === false) {
      throw new UnauthorizedException('Incorrect password for this url!');
    }

    try {
      await this.shortenerProducer.publish({
        ...clientDetails,
        key: data.key,
        url: data.url,
      });
    } catch (err) {
      this.logger.error(`Error while publishing shortened url: ${err.message}`);
    }

    return {
      url: addUtmParams(data.url, data.utm),
      key: data.key,
    };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async shortener(@Body() shortenerDto: ShortenerDto, @Req() req: Request): Promise<{ key: string }> {
    const user = req.user as UserContext;

    // Check if the url is safe
    if (this.configService.getConfig().safeUrl.enable) {
      const isSafeUrl = await this.safeUrlService.isSafeUrl(shortenerDto.url);
      if (!isSafeUrl) {
        throw new BadRequestException('This url is not safe to shorten!');
      }
    }

    if (shortenerDto.key) {
      const isKeyAvailable = await this.shortenerService.isKeyAvailable(shortenerDto.key);
      if (!isKeyAvailable) {
        throw new BadRequestException('This short link already exists');
      }
    }

    if (shortenerDto.temporary) {
      // Temporary links cannot be password protected
      const { password, ...rest } = shortenerDto;
      return this.shortenerService.createShortenedUrl(rest);
    }

    // Hash the password if it exists in the request
    if (shortenerDto.password) {
      shortenerDto.password = await this.shortenerService.hashPassword(shortenerDto.password);
    }

    // Only verified users can create shortened urls
    if (!user?.verified) {
      throw new BadRequestException('You must be verified in to create a shortened url');
    }

    this.logger.log(`User ${user.id} is creating a shortened url for ${shortenerDto.url}`);
    return this.shortenerService.createUsersShortenedUrl(user, shortenerDto);
  }
}
