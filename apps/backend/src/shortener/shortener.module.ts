import { Module } from '@nestjs/common';
import { ShortenerController } from '@rt/backend/shortener/shortener.controller';
import { ShortenerService } from '@rt/backend/shortener/shortener.service';
import { PrismaModule } from '@rt/prisma';
import { ShortenerProducer } from '@rt/backend/shortener/producer/shortener.producer';
import { QueueManagerModule, QueueManagerService } from '@rt/queue-manager';

@Module({
  imports: [PrismaModule, QueueManagerModule],
  controllers: [ShortenerController],
  providers: [ShortenerService, ShortenerProducer, QueueManagerService],
  exports: [ShortenerService],
})
export class ShortenerModule {}
