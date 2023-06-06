import { Controller, Get, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../shared/decorators/roles/roles.decorator';
import { calculateSkip, IPaginationResult } from '../shared/utils';
import { FindAllQueryDto } from './dto';
import { UsersService } from './users.service';
import { SortUserDto } from './dto/sort-user.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async findAll(@Query() query: FindAllQueryDto, @Query('sort') sort: SortUserDto): Promise<IPaginationResult<User>> {
    const { page, limit, filter } = query;

    return this.usersService.findAll({
      ...(page && { skip: calculateSkip(page, limit) }), // if page is defined, then calculate skip
      limit,
      filter,
      sort,
    });
  }
}
