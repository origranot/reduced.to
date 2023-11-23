import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PrismaModule } from '@reduced.to/prisma';
import { LinksModule } from '../links/links.module';

@Module({
  imports: [AuthModule, PrismaModule, LinksModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
