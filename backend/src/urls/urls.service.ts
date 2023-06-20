import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateUrlDto } from './dto';
import { Url } from '@prisma/client';

@Injectable()
export class UrlsService {
  constructor(private readonly prisma: PrismaService) {}

  async updateUrl(updateUrl: UpdateUrlDto, urlId: string): Promise<Url> {
    return this.prisma.url.update({
      where: { id: urlId },
      data: updateUrl,
    });
  }

  async getUrls(userId: string): Promise<Url[]> {
    if (!userId) {
      return [];
    }
    return this.prisma.url.findMany({
      where: { userId },
    });
  }
}
