import { Global, Module } from '@nestjs/common';
import { AppLoggerSerivce } from '@reduced.to/logger';

@Global()
@Module({
  providers: [AppLoggerSerivce],
  exports: [AppLoggerSerivce],
})
export class AppLoggerModule {}
