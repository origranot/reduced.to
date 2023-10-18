import { Module } from '@nestjs/common';
import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './shortener.service';
import { PrismaModule } from '@reduced.to/prisma';
import { ShortenerProducer } from './producer/shortener.producer';
import { QueueManagerModule, QueueManagerService } from '@reduced.to/queue-manager';

@Module({
  imports: [PrismaModule, QueueManagerModule],
  controllers: [ShortenerController],
  providers: [ShortenerService, ShortenerProducer, QueueManagerService],
  exports: [ShortenerService],
})
export class ShortenerModule {}
