import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  app.useStaticAssets(join(__dirname, 'public'));

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3000);
  const port = app.get(AppConfigService).getConfig().app.port;

  await app.listen(port);
}

bootstrap();
