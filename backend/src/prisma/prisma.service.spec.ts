import { PrismaService } from './prisma.service';
import { Test } from '@nestjs/testing';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = app.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
