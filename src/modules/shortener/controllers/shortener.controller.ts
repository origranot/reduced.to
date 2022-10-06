import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
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
    let potentialUrl: string = body.originalUrl;

    if (!(potentialUrl.startsWith("http://")) || potentialUrl.startsWith("https://")) {
		  potentialUrl = "https://" + potentialUrl
	  }

    try {
      parsedUrl = new URL(potentialUrl);
    } catch (err: any) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'URL is invalid',
      }, HttpStatus.BAD_REQUEST);
    }

    let shortUrl: string = this.shortenerService.getShortUrl(parsedUrl.href);

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
