import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { IPaginationResult, calculateSkip } from '../../shared/utils';
import { Role } from '@reduced.to/prisma';
import { Roles } from '../../shared/decorators';
import { ReportsService } from './reports.service';
import { FindAllQueryDto } from './dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({
  path: 'reports',
  version: '1',
})
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query() query: FindAllQueryDto): Promise<IPaginationResult<Report>> {
    const { page, limit, filter, sort } = query;

    return this.reportsService.findAll({
      ...(page && { skip: calculateSkip(page, limit) }), // if page is defined, then calculate skip
      limit,
      filter,
      sort,
    });
  }
}
