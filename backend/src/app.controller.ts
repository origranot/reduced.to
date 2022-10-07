import { Controller, Get, Param, Redirect, Render, VERSION_NEUTRAL } from '@nestjs/common';

@Controller({
  version: VERSION_NEUTRAL
})
export class AppController {
  constructor() { }

  @Get()
  @Render('index')
  root() {
    return;
  }

  @Get(':path')
  @Redirect('http://localhost:3000', 301)
  redirect(@Param() params: { path: string }) {
	  const originalUrl = global.URL_DICT[params.path];
    if (originalUrl !== undefined) {
      return { url: originalUrl }
    }
    return;
  }
}
