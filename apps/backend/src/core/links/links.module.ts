import { Module } from '@nestjs/common';
import { AuthModule } from '@rt/backend/auth/auth.module';
import { PrismaModule } from '@rt/prisma';
import { LinksController } from '@rt/backend/core/links/links.controller';
import { LinksService } from '@rt/backend/core/links/links.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [LinksController],
  providers: [LinksService],
  exports: [LinksService],
})
export class LinksModule {}
