import { Global, Module } from '@nestjs/common';
import { AppLoggerSerivce } from './logger.service';

@Global()
@Module({
  providers: [AppLoggerSerivce],
  exports: [AppLoggerSerivce],
})
export class AppLoggerModule {}
