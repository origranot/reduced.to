import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfigService } from '@rt/config';
import { AppModule } from './app/app.module';
import { AppLoggerSerivce } from '@rt/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  app.enableCors({ origin: true, credentials: true });

  const port = app.get(AppConfigService).getConfig().general.trackerPort;
  const logger = app.get(AppLoggerSerivce);

  await app.listen(port);

  logger.log(`Starting tracker on port ${port}`);
}

bootstrap();
