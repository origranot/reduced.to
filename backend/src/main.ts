import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  app.use(cookieParser());
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(new ValidationPipe());

  // Enable DI in class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const port = app.get(AppConfigService).getConfig().app.port;

  await app.listen(port);
}

bootstrap();
