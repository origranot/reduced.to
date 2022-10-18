import {
  Controller,
  Get,
  Param,
  Redirect,
  Render,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ShortenerService } from './shortener/shortener.service';

@Controller({
  version: VERSION_NEUTRAL,
})
export class AppController {
  constructor(private readonly ShortenerService: ShortenerService) {}

  @Get()
  @Render('index')
  root() {
    return;
  }

  @Get()
  @Render('unknown')
  unknown() {
    return;
  }

  @Get(':path')
  @Redirect()
  async redirect(@Param() params: { path: string }) {
    const originalUrl = await this.ShortenerService.getOriginalUrl(params.path);
    if (originalUrl !== null) {
      return { url: originalUrl };
    }

    // 404, redirect to /unknown
    return { url: '/unknown' };
  }
}
