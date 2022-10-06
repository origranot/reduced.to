import { Module } from "@nestjs/common";
import { ShortenerController } from "./shortener.controller";
import { ShortenerService } from "./shortener.service";

@Module({
  controllers: [
    ShortenerController
  ],
  providers: [
    ShortenerService
  ]
})
export class ShortenerModule {}