import { Module } from '@nestjs/common';
import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './shortener.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShortenerController],
  providers: [ShortenerService],
  exports: [ShortenerService],
})
export class ShortenerModule {}
