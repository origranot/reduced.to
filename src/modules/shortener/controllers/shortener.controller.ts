import { Controller, Post } from '@nestjs/common';
import { ShortenerService } from '../services/shortener.service';

@Controller({
  version: '1'
})

export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}
  @Post()
  requestHandler() {
    return this.shortenerService.shortUrl();
  }
}
