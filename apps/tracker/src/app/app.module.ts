import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '@reduced.to/config';
import { AppLoggerModule } from '@reduced.to/logger';
import { VisitsModule } from '../visits/visits.module';

@Global()
@Module({
  imports: [AppConfigModule, AppLoggerModule, VisitsModule],
})
export class AppModule {}
