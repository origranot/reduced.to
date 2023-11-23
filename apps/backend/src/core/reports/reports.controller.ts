import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { IPaginationResult, calculateSkip } from '../../shared/utils';
import { Report, Role } from '@reduced.to/prisma';
import { Roles } from '../../shared/decorators';
import { ReportsService } from './reports.service';
import { FindAllQueryDto, CreateReportDto } from './dto';
import { LinksService } from '../links/links.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({
  path: 'reports',
  version: '1',
})
export class ReportsController {
  constructor(private readonly reportsService: ReportsService, private readonly linksService: LinksService) {}

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
    const { url } = await this.linksService.findBy({
      key,
    });

    if (!url) {
      throw new NotFoundException('This link might be expired or does not exist.');
    }

    return this.reportsService.create({
      key,
      url,
      category,
    });
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Query('id') id: string): Promise<Report> {
    const response = await this.linksService.findBy({
      id,
    });

    if (!response) {
      throw new NotFoundException('This report does not exist.');
    }

    return this.reportsService.delete(id);
  }
}
