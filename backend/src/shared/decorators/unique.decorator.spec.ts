import { UniqueConstraint, Unique } from './unique.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationArguments } from 'class-validator';

interface TestValidationArguments extends ValidationArguments {
  constraints: string[];
  property: string;
}

describe('UniqueDecorator', () => {
  let prismaService: PrismaService;
  let uniqueConstraint: UniqueConstraint;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UniqueConstraint,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    uniqueConstraint = module.get<UniqueConstraint>(UniqueConstraint);
  });

  it('should be defined', () => {
    expect(uniqueConstraint).toBeDefined();
  });

  it('should return true if the value is unique', async () => {
    (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
    const isUnique = await uniqueConstraint.validate('uniqueValue', {
      constraints: ['user'],
      property: 'email',
    } as TestValidationArguments);
    expect(isUnique).toBe(true);
  });

  it('should return false if the value is not unique', async () => {
    (prismaService.user.findUnique as jest.Mock).mockResolvedValue({});
    const isUnique = await uniqueConstraint.validate('test@example.com', {
      constraints: ['user'],
      property: 'email',
    } as TestValidationArguments);
    expect(isUnique).toBe(false);
  });

  it('should return the default message if the value is not unique', async () => {
    (prismaService.user.findUnique as jest.Mock).mockResolvedValue({});
    const defaultMessage = uniqueConstraint.defaultMessage({
      constraints: ['User'],
      property: 'email',
    } as TestValidationArguments);
    expect(defaultMessage).toBe('email is already exists!');
  });

  it('should throw an error if the constraint is not valid', async () => {
    try {
      await uniqueConstraint.validate('value', {
        constraints: ['invalidModel'],
        property: 'property',
      } as TestValidationArguments);
      throw new Error('Expected an error to be thrown!');
    } catch (err) {
      expect(err.message).toBe('Model invalidModel is not exist');
    }
  });
});
