import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role, User } from '@reduced.to/prisma';
import { FindAllQueryDto, CountQueryDto } from './dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../shared/decorators';
import { IPaginationResult, calculateSkip } from '../../shared/utils';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query() query: FindAllQueryDto): Promise<IPaginationResult<User>> {
    const { page, limit, filter, sort } = query;

    return this.usersService.findAll({
      ...(page && { skip: calculateSkip(page, limit) }), // if page is defined, then calculate skip
      limit,
      filter,
      sort,
    });
  }

  @Get('count')
  @Roles(Role.ADMIN)
  async count(@Query() { startDate, endDate, verified }: CountQueryDto) {
    const filter: Record<string, any> = {};

    if (startDate && endDate) {
      filter.createdAt = { gte: startDate, lte: endDate };
    }

    if (typeof verified === 'boolean') {
      filter.verified = verified;
    }

    // Perform the count operation with the dynamic filter
    const count = await this.usersService.count(filter);

    return { count };
  }
}
