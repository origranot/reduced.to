import { Routes } from "@nestjs/core";
import { ShortenerModule } from "src/modules/shortener/shortener.module";

export const shortenerRoutes: Routes = [
  {
    path: "shortener",
    module: ShortenerModule,
  },
];