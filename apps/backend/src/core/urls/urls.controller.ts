import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UrlsService } from './urls.service';
import { IPaginationResult, calculateSkip } from '../../shared/utils';
import { FindAllQueryDto } from './dto';
import { Role, Url } from '@prisma/client';
import { Roles } from '../../shared/decorators';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({
  path: 'urls',
  version: '1',
})
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query() query: FindAllQueryDto): Promise<IPaginationResult<Url>> {
    const { page, limit, filter, sort } = query;

    return this.urlsService.findAll({
      ...(page && { skip: calculateSkip(page, limit) }), // if page is defined, then calculate skip
      limit,
      filter,
      sort,
    });
  }
}
