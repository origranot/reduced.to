import { Module } from '@nestjs/common';
import { AppLoggerSerivce } from './logger.service';

@Module({
  providers: [AppLoggerSerivce],
  exports: [AppLoggerSerivce],
})
export class AppLoggerModule {}
