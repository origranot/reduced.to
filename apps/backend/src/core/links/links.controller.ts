import { Controller, Delete, Get, Param, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@rt/backend/auth/guards/jwt.guard';
import { RolesGuard } from '@rt/backend/auth/guards/roles.guard';
import { LinksService } from '@rt/backend/core/links/links.service';
import { IPaginationResult, calculateSkip } from '@rt/backend/shared/utils';
import { FindAllQueryDto } from '@rt/backend/core/links/dto';
import { Role, Link } from '@rt/prisma';
import { Roles, UserCtx } from '@rt/backend/shared/decorators';
import { Request } from 'express';
import { UserContext } from '@rt/backend/auth/interfaces/user-context';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({
  path: 'links',
  version: '1',
})
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  async findAll(@Req() request: Request, @Query() query: FindAllQueryDto): Promise<IPaginationResult<Link>> {
    const { page, limit, filter, sort } = query;
    const user = request.user as UserContext;

    return this.linksService.findAll({
      ...(page && { skip: calculateSkip(page, limit) }), // if page is defined, then calculate skip
      limit,
      filter,
      sort,
      // Allways add extraWhereClause to the query, so that the user can only see his own links
      extraWhereClause: {
        userId: user?.id,
      },
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async delete(@UserCtx() user: UserContext, @Param('id') id: string): Promise<Link> {
    const link = await this.linksService.findBy({
      userId: user.id,
      id,
    });

    if (!link) {
      throw new UnauthorizedException();
    }

    return this.linksService.delete(id);
  }
}
