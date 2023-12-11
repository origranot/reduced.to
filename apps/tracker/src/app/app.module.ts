import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '@reduced.to/config';
import { AppLoggerModule } from '@reduced.to/logger';
import { StatsModule } from '../stats/stats.module';

@Global()
@Module({
  imports: [AppConfigModule, AppLoggerModule, StatsModule],
})
export class AppModule {}
