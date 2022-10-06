import { Body, Controller, Post } from '@nestjs/common';
import { ShortenerDTO } from '../dto/shortener.dto';
import { ShortenerService } from '../services/shortener.service';

@Controller({
  version: '1'
})

export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) { }
  @Post()
  requestHandler(@Body() body: ShortenerDTO) {
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(body.originalUrl);
    } catch (err) {
      //Implement throw exception
      return;
    }

    let shortUrl = this.shortenerService.getShortUrl(parsedUrl.href);

    if (shortUrl !== null) {
      return { newUrl: shortUrl };
    }

    do {
      shortUrl = this.shortenerService.generateShortUrl();
    } while (!this.shortenerService.isShortUrlAvailable(shortUrl));

    this.shortenerService.addUrl(parsedUrl.href, shortUrl);
    return { newUrl: shortUrl };
  }
}
