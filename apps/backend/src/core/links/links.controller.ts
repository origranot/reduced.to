import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { LinksService } from './links.service';
import { IPaginationResult, calculateSkip } from '../../shared/utils';
import { FindAllQueryDto } from './dto';
import { Role, Link } from '@reduced.to/prisma';
import { Roles } from '../../shared/decorators';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({
  path: 'links',
  version: '1',
})
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query() query: FindAllQueryDto): Promise<IPaginationResult<Link>> {
    const { page, limit, filter, sort } = query;

    return this.linksService.findAll({
      ...(page && { skip: calculateSkip(page, limit) }), // if page is defined, then calculate skip
      limit,
      filter,
      sort,
    });
  }
}
