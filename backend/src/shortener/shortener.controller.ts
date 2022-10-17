import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ShortenerDTO } from './dto/shortener.dto';
import { ShortenerService } from './shortener.service';

const regexBadHttp = new RegExp(
  /^([^hH][tT][tT][pP]|[hH][^tT][tT][pP]|[hH][tT][^tT][pP]|[hH][tT][tT][^pP])/
);
const regexUrlSchema = new RegExp(/^(.+:|\.)/);

@Controller({
  path: 'shortener',
  version: '1',
})
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @Post()
  async shortener(@Body() body: ShortenerDTO) {
    let parsedUrl: URL;
    try {
      const prepend = regexUrlSchema.test(body.originalUrl)
        ? ''
        : body.originalUrl.substring(0, 1) === ':'
        ? 'http'
        : 'http:/';
      parsedUrl = new URL(
        (prepend + body.originalUrl).replace(regexBadHttp, 'http')
      );
    } catch (err: any) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'URL is invalid',
      });
    }

    let shortUrl: string;

    do {
      shortUrl = this.shortenerService.generateShortUrl();
    } while (!(await this.shortenerService.isShortUrlAvailable(shortUrl)));

    await this.shortenerService.addUrl(parsedUrl.href, shortUrl);
    return { newUrl: shortUrl };
  }
}
