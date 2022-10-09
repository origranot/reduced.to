import { ShortenerService } from './shortener/shortener.service';
import { Controller, Get, Param, Redirect, Render, VERSION_NEUTRAL } from '@nestjs/common';

@Controller({
  version: VERSION_NEUTRAL
})
export class AppController {
  constructor(private readonly ShortenerService: ShortenerService) { }

  @Get()
  @Render('index')
  root() {
    return;
  }

  @Get(':path')
  @Redirect()
  async redirect(@Param() params: { path: string }) {
    const originalUrl = await this.ShortenerService.getOriginalUrl(params.path);
    if (originalUrl !== null) {
      return { url: originalUrl }
    }
    return '404!'; //TODO: Implement a 404 page.
  }
}
