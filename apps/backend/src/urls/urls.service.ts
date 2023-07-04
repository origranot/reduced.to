import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateUrlDto } from './dto';
import { Url } from '@prisma/client';
import { CreateUrlInterface } from './interfaces/create-url.interface';

@Injectable()
export class UrlsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates a URL with the provided data.
   * @param {UpdateUrlDto} updateUrl - The data to update the URL.
   * @param {string} urlId - The ID of the URL to update.
   * @returns {Promise<Url>} The updated URL.
   */
  updateUrl = async (updateUrl: UpdateUrlDto, urlId: string): Promise<Url> => {
    return this.prisma.url.update({
      where: { id: urlId },
      data: updateUrl,
    });
  };

  /**
   * Retrieves all URLs associated with the provided user ID.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Url[]>} An array of URLs associated with the user.
   */
  getUrls = async (userId: string): Promise<Url[]> => {
    if (!userId) {
      return [];
    }
    return this.prisma.url.findMany({
      where: { userId },
    });
  };

  /**
   * Deletes a URL with the provided ID.
   * @param {string} urlId - The ID of the URL to delete.
   * @returns {Promise<void>}
   */
  deleteUrl = async (urlId: string) => {
    return this.prisma.url.delete({
      where: { id: urlId },
    });
  };

  /**
   * Retrieves a URL based on the provided selection criteria.
   * @param {Partial<Url>} select - The selection criteria for the URL.
   * @returns {Promise<Url>} The matched URL.
   */
  getUrl = async (select: Partial<Url>): Promise<Url> => {
    return this.prisma.url.findUnique({
      where: select,
    });
  };

  /**
   * Creates a new URL with the provided data.
   * @param {CreateUrlInterface} urlData - The data for the new URL.
   * @returns {Promise<Url>} The created URL.
   */
  create = async (urlData: CreateUrlInterface): Promise<Url> => {
    return this.prisma.url.create({
      data: urlData,
    });
  };
}
