import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PrismaModule } from '@reduced.to/prisma';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
