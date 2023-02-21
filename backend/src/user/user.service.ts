import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async get(id: string) {
    console.log(id);
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return user;
  }
}
