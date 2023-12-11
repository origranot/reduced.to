import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '@reduced.to/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppLoggerModule } from '@reduced.to/logger';
import { QueueManagerService } from '@reduced.to/queue-manager';
import { StatsModule } from '../stats/stats.module';

@Global()
@Module({
  imports: [AppConfigModule, AppLoggerModule, StatsModule],
  controllers: [AppController],
  providers: [AppService, QueueManagerService],
})
export class AppModule {}
