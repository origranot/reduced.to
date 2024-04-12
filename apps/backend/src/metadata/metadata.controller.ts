import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Metadata, MetadataService } from './metadata.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({
  path: 'metadata',
  version: '1',
})
export class MetadataController {
  constructor(private metadataService: MetadataService) {}

  @Get()
  async fetch(@Query('url') url: string): Promise<Metadata> {
    return this.metadataService.fetch(url);
  }
}
