import { Module } from '@nestjs/common';
import { AuthModule } from '@rt/backend/auth/auth.module';
import { ReportsController } from '@rt/backend/core/reports/reports.controller';
import { ReportsService } from '@rt/backend/core/reports/reports.service';
import { PrismaModule } from '@rt/prisma';
import { LinksModule } from '@rt/backend/core/links/links.module';

@Module({
  imports: [AuthModule, PrismaModule, LinksModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
