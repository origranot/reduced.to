import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { IPaginationResult, calculateSkip } from '../../shared/utils';
import { Link, Report, Role } from '@reduced.to/prisma';
import { Roles } from '../../shared/decorators';
import { ReportsService } from './reports.service';
import { FindAllQueryDto, CreateReportDto } from './dto';
import { LinksService } from '../links/links.service';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt-auth.guard';
import { AppCacheService } from '../../cache/cache.service';

@UseGuards(OptionalJwtAuthGuard, RolesGuard)
@Controller({
  path: 'reports',
  version: '1',
})
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly linksService: LinksService,
    private readonly cacheService: AppCacheService
  ) {}

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

  @Post()
  async create(@Body() { link, category }: CreateReportDto): Promise<Report> {
    if (!this.reportsService.isUrlReportable(link)) {
      throw new BadRequestException('You can only report links that are shortened by us.');
    }

    const key = link.split('/').pop();
    const response = await this.linksService.findBy({
      key,
    });

    if (!response) {
      throw new NotFoundException('This link might be expired or does not exist.');
    }

    return this.reportsService.create({
      key,
      category,
    });
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string, @Query('deleteLink') deleteLink?: boolean): Promise<any> {
    const report = await this.reportsService.findById(id);

    if (!report) {
      throw new NotFoundException('This report does not exist.');
    }

    if (deleteLink) {
      // Should delete the link from the cache as well
      await this.cacheService.del(report.link?.key);

      return this.linksService.delete(report.link.id);
    }

    return this.reportsService.delete(id);
  }
}
