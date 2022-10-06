import { Controller, Get, Render, VERSION_NEUTRAL } from '@nestjs/common';

@Controller({
  version: VERSION_NEUTRAL
})
export class AppController {
  @Get()
  @Render('index')
  root() {
    return;
  }
}
