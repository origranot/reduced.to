import { Controller, Get, Post, Render, VERSION_NEUTRAL } from '@nestjs/common';
import { AppService } from './app.service';

@Controller({
  version: VERSION_NEUTRAL
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root() {
    return;
  }

  @Post()
  requestHandle() {
    this.appService.getHello();
  }
}
