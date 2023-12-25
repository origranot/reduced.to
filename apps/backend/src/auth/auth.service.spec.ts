import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ProviderType, Role, User } from '@reduced.to/prisma';
import * as bcrypt from 'bcryptjs';
import { AppConfigModule } from '@reduced.to/config';
import { PrismaService } from '@reduced.to/prisma';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { StorageService } from '../storage/storage.service';

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
              create: jest.fn(),
            },
          },
        },
        {
          provide: StorageService,
          useValue: jest.fn(),
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
      createdAt: new Date(),
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
  describe('signup', () => {
    let createUserSpy: jest.SpyInstance;

    beforeEach(() => {
      // We don't care about the return value, just make sure the correct data is passed to the create method
      createUserSpy = jest.spyOn(prismaService.user, 'create').mockResolvedValueOnce(null);
      jest.spyOn(authService['jwtService'], 'sign').mockReturnValueOnce('verification_token');
    });

    afterEach(() => {
      createUserSpy.mockClear();
    });

    const signupDto: SignupDto = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
      provider: undefined,
    };

    it('should create a new user with correct data when no prvovider is provided', async () => {
      await authService.signup(signupDto);
      const createUserParams = createUserSpy.mock.calls[0][0].data;

      expect(createUserParams.name).toBe(signupDto.name);
      expect(createUserParams.email).toBe(signupDto.email);
      expect(createUserParams.password).toEqual(expect.any(String)); // Password is hashed
      expect(createUserParams.role).toBe(Role.USER);
      expect(createUserParams.verified).toBe(undefined);
      expect(createUserParams.verificationToken).toEqual(expect.any(String)); // Verification token is generated
      expect(createUserParams.authProviders).toBeUndefined();
    });

    it('should create a new user with correct data when a prvovider is provided', async () => {
      // Set Google as provider
      signupDto.provider = ProviderType.GOOGLE;

      await authService.signup(signupDto);
      const createUserParams = createUserSpy.mock.calls[0][0].data;

      expect(createUserParams.name).toBe(signupDto.name);
      expect(createUserParams.email).toBe(signupDto.email);
      expect(createUserParams.password).toEqual(expect.any(String)); // Password is hashed provider id
      expect(createUserParams.role).toBe(Role.USER);
      expect(createUserParams.verified).toBe(true);
      expect(createUserParams.verificationToken).toEqual(undefined);
      expect(createUserParams.authProviders.create).toStrictEqual({
        provider: signupDto.provider,
        providerId: signupDto.password,
      });
    });
  });
});
