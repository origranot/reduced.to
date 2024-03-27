import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '@rt/config';
import { AppLoggerModule } from '@rt/logger';
import { StatsModule } from '../stats/stats.module';

@Global()
@Module({
  imports: [AppConfigModule, AppLoggerModule, StatsModule],
})
export class AppModule {}
