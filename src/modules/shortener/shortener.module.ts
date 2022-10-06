import { Module } from "@nestjs/common";
import { ShortenerController } from "./controllers";
import { ShortenerService } from "./services";

@Module({
  controllers: [
    ShortenerController
  ],
  providers: [
    ShortenerService
  ]
})
export class ShortenerModule {}