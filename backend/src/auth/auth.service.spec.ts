import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AppConfigModule } from '../config/config.module';
import { PrismaService } from './../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let mockData: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [
        AuthService,
        JwtService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    mockData = {
      id: 'some-id',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: await bcrypt.hash('password', 10),
      verified: false,
      verificationToken: 'verification_token',
      role: Role.USER,
      refreshToken: 'refresh',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(prismaService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return null if user does not exist', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);
      const user = await authService.validateUser('fake@email.com', 'password');
      expect(user).toBeNull();
    });

    it('should return null if the password is incorrect', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(mockData);
      const user = await authService.validateUser(mockData.email, 'wrongpassword');
      expect(user).toBeNull();
    });

    it('should return the user if email and password match', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(mockData);
      const user = await authService.validateUser(mockData.email, 'password');
      expect(user.email).toEqual(mockData.email);
    });
  });

  describe('verify', () => {
    it('should throw an unauthorized exception if the verification token is invalid', async () => {
      jest.spyOn(prismaService.user, 'update').mockResolvedValueOnce(null);
      expect(async () => {
        await authService.verify({
          ...mockData,
        });
      }).rejects.toThrow(UnauthorizedException);
    });

    it('should return true and update the user if the verification token is valid', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(mockData);
      jest.spyOn(prismaService.user, 'update').mockResolvedValueOnce({
        ...mockData,
        verified: true,
        verificationToken: null,
      });
      const verified = await authService.verify(mockData);
      expect(verified).toBeTruthy();
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { email: mockData.email },
        data: { verified: true, verificationToken: null },
      });
    });
  });
});
