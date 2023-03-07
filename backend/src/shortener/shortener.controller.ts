import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ShortenerDTO } from './dto/shortener.dto';
import { ShortenerService } from './shortener.service';

@Controller({
  path: 'shortener',
  version: '1',
})
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @Get(':shortUrl')
  async findOne(@Param('shortUrl') shortUrl: string) {
    const originalUrl = await this.shortenerService.getOriginalUrl(shortUrl);
    if (!originalUrl) {
      throw new BadRequestException('Short url is wrong or expired');
    }

    return originalUrl;
  }

  @Post()
  async shortener(@Body() body: ShortenerDTO) {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(body.originalUrl);

      // Checks if the URL is already reduced.
      if (this.shortenerService.isUrlAlreadyShortend(body.originalUrl)) {
        throw new Error('The URL is already shortened...');
      }
    } catch (err: any) {
      throw new BadRequestException(err.message || 'URL is invalid');
    }

    let shortUrl: string;

    do {
      shortUrl = this.shortenerService.generateShortUrl();
    } while (!(await this.shortenerService.isShortUrlAvailable(shortUrl)));

    await this.shortenerService.addUrl(parsedUrl.href, shortUrl);
    return { newUrl: shortUrl };
  }
}
