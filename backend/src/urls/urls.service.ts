import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateUrlDto } from './dto';
import { Url } from '@prisma/client';
import { CreateUrlInterface } from './interfaces/create-url.interface';

@Injectable()
export class UrlsService {
  constructor(private readonly prisma: PrismaService) {}

  updateUrl = async (updateUrl: UpdateUrlDto, urlId: string): Promise<Url> => {
    return this.prisma.url.update({
      where: { id: urlId },
      data: updateUrl,
    });
  };

  getUrls = async (userId: string): Promise<Url[]> => {
    if (!userId) {
      return [];
    }
    return this.prisma.url.findMany({
      where: { userId },
    });
  };

  deleteUrl = async (urlId: string) => {
    return this.prisma.url.delete({
      where: { id: urlId },
    });
  };

  getUrl = async (select: Partial<Url>): Promise<Url> => {
    return this.prisma.url.findUnique({
      where: select,
    });
  };

  create = async (urlData: CreateUrlInterface): Promise<Url> => {
    return this.prisma.url.create({
      data: urlData,
    });
  };
}
