import { Module } from "@nestjs/common";
import { RouterModule, Routes } from "@nestjs/core";
import { shortenerRoutes } from "./shortener/shortener.router";

const routes: Routes = [...shortenerRoutes];

@Module({
  imports: [RouterModule.register(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}