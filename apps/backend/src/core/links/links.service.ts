import { Injectable } from '@nestjs/common';
import { EntityService } from '../entity.service';
import { Link, Prisma, PrismaService } from '@reduced.to/prisma';

@Injectable()
export class LinksService extends EntityService<Link> {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  get model(): string {
    return 'link';
  }

  get selectFields(): Partial<Record<keyof Prisma.LinkWhereInput, boolean>> {
    return {
      id: true,
      url: true,
      key: true,
      clicks: true,
      description: true,
      expirationTime: true,
      createdAt: true,
    };
  }

  get filterFields(): Partial<Record<keyof Prisma.LinkWhereInput, boolean>> {
    return {
      url: true,
      key: true,
    };
  }

  findBy(opts: Prisma.LinkWhereInput): Promise<Link> {
    return this.prismaService.link.findFirst({
      where: opts,
    });
  }

  delete(id: string): Promise<Link> {
    return this.prismaService.link.delete({
      where: {
        id,
      },
      include: {
        visit: true,
      },
    });
  }
}
