import { Module } from '@nestjs/common';
import { PrismaModule } from '@reduced.to/prisma';
import { UsageService } from './usage.service';

@Module({
  imports: [PrismaModule],
  providers: [UsageService],
  exports: [UsageService],
})
export class UsageModule {}
