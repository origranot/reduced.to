import { Module } from '@nestjs/common';
import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';

@Module({
  providers: [MetadataService],
  controllers: [MetadataController],
})
export class MetadataModule {}
