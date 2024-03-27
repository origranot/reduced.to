import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication, ValidationPipe } from '@nestjs/common';
import { agent as supertest, SuperAgentTest } from 'supertest';
import { AuthController } from '@rt/backend/auth/auth.controller';
import { AuthService } from '@rt/backend/auth/auth.service';
import { NovuService } from '@rt/backend/novu/novu.service';
import { PrismaService } from '@rt/prisma';
import { AppConfigService, Configuration } from '@rt/config';
import { SignupDto } from '@rt/backend/auth/dto/signup.dto';
import { UserContext } from '@rt/backend/auth/interfaces/user-context';
import { LocalAuthGuard } from '@rt/backend/auth/guards/local.guard';
import { JwtRefreshAuthGuard } from '@rt/backend/auth/guards/jwt-refresh.guard';
import { JwtAuthGuard } from '@rt/backend/auth/guards/jwt.guard';
import { VerifyAuthGuard } from '@rt/backend/auth//guards/verify.guard';
import { UniqueConstraint } from '@rt/backend/shared/decorators/unique/unique.decorator';
import { useContainer } from 'class-validator';

describe('AuthController', () => {
  let app: INestApplication;
  let authService: AuthService;
  let prismaService: PrismaService;
  let novuService: NovuService;
  let authenticatedRequest: SuperAgentTest;

  let validTokens: { accessToken: string; refreshToken: string };

  const mockedSignupDto: SignupDto = {
    name: 'test',
    email: 'test@example.com',
    password: 'password',
  };

  const mockedUserContext: Partial<UserContext> = {
    id: '1',
    ...mockedSignupDto,
  };

  const MOCK_TOKENS = { accessToken: 'access_token', refreshToken: 'refresh_token' };
  const MOCK_CONFIG: Partial<Configuration> = {
    front: { domain: 'example.com', apiDomain: 'http://localhost:3000', clientSideApiDomain: 'http://localhost:3000' },
    general: { env: 'production', backendPort: 3000, frontendPort: 5000, trackerPort: 3001 },
    auth: {
      jwt: {
        accessSecret: 'secret',
        refreshSecret: 'secret',
      },
      google: {} as any,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue(MOCK_TOKENS),
            signup: jest.fn().mockResolvedValue(mockedUserContext),
            refreshTokens: jest.fn().mockResolvedValue(MOCK_TOKENS),
            verify: jest.fn().mockResolvedValue({ verified: true }),
            generateTokens: jest.fn().mockResolvedValue(MOCK_TOKENS),
            checkVerification: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockResolvedValue(mockedUserContext),
            },
          },
        },
        {
          provide: UniqueConstraint,
          useValue: {
            validate: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: NovuService,
          useValue: {
            sendVerificationEmail: jest.fn(),
          },
        },
        {
          provide: AppConfigService,
          useValue: {
            getConfig: jest.fn().mockReturnValue(MOCK_CONFIG),
          },
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({
        canActivate: () => {
          return true;
        },
      })
      .overrideGuard(JwtRefreshAuthGuard)
      .useValue({
        canActivate: () => {
          return true;
        },
      })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          const token = /accessToken=(.+);/.exec(req.headers.cookie);
          if (!token || token[1] !== MOCK_TOKENS.accessToken) {
            return false;
          }

          req.user = mockedUserContext;
          return true;
        },
      })
      .overrideGuard(VerifyAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          if (req.headers?.token !== MOCK_TOKENS.accessToken) {
            return false;
          }

          req.user = mockedUserContext;
          return true;
        },
      })
      .compile();

    app = module.createNestApplication();
    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    novuService = module.get<NovuService>(NovuService);

    validTokens = await authService.generateTokens(mockedUserContext as UserContext);

    // Set up request with valid tokens and JSON body
    authenticatedRequest = new Proxy(supertest(app.getHttpServer()), {
      get:
        (target, name) =>
        (...args: any) =>
          (target as any)[name](...args).set({
            token: validTokens.accessToken,
            Cookie: `accessToken=${validTokens.accessToken}; refreshToken=${validTokens.refreshToken}`,
            Accept: 'application/json',
          }),
    });

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    // Enable DI in class-validator
    useContainer(module, { fallbackOnErrors: true });

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should return tokens and set cookies', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/auth/login')
        .send({ email: mockedSignupDto.email, password: mockedSignupDto.password })
        .expect(201);

      expect(authService.login).toHaveBeenCalled();
      expect(response.header['set-cookie']).toBeDefined();
      expect(response.body).toEqual(MOCK_TOKENS);
    });
  });

  describe('POST /auth/signup', () => {
    it('should create a new user, send verification email, return tokens, and set cookies', async () => {
      const response = await supertest(app.getHttpServer()).post('/auth/signup').send(mockedSignupDto).expect(201);

      expect(authService.signup).toHaveBeenCalledWith(mockedSignupDto);
      expect(novuService.sendVerificationEmail).toHaveBeenCalledWith(mockedUserContext);
      expect(authService.login).toHaveBeenCalledWith(mockedUserContext);
      expect(response.header['set-cookie']).toBeDefined();
      expect(response.body).toEqual(MOCK_TOKENS);
    });

    it('should throw an error if email and password are not sent', async () => {
      await supertest(app.getHttpServer()).post('/auth/signup').send().expect(400);
    });

    it('should throw an error if email is in the wrong format', async () => {
      await supertest(app.getHttpServer())
        .post('/auth/signup')
        .send({ name: 'test', email: 'invalid_email', password: 'password' })
        .expect(400);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should return refreshed tokens', async () => {
      const response = await authenticatedRequest.post('/auth/refresh').expect(201);

      expect(authService.refreshTokens).toHaveBeenCalled();
      expect(response.body).toEqual(MOCK_TOKENS);
    });
  });

  describe('GET /auth/check-auth', () => {
    it('should return user context', async () => {
      const response = await authenticatedRequest.get('/auth/check-auth').expect(200);

      expect(response.body).toEqual({ user: mockedUserContext });
    });
  });

  describe('GET /auth/resend', () => {
    it('should send verification email and return response', async () => {
      const response = await authenticatedRequest.get('/auth/resend').expect(200);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockedUserContext.id },
      });
      expect(novuService.sendVerificationEmail).toHaveBeenCalledWith(mockedUserContext);
      expect(response.text).toBeDefined();
    });
  });

  describe('GET /auth/verify', () => {
    it('should verify user, generate tokens, set cookies, and return verification data', async () => {
      const response = await authenticatedRequest.get('/auth/verify').expect(200);

      expect(authService.verify).toHaveBeenCalledWith(mockedUserContext);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockedUserContext.email },
      });
      expect(authService.generateTokens).toHaveBeenCalledWith(mockedUserContext);
      expect(response.header['set-cookie']).toBeDefined();
      expect(response.body).toEqual({ verified: true });
    });

    it('should throw UnauthorizedException if verification fails', async () => {
      (authService.verify as jest.Mock).mockResolvedValue({ verified: false });

      await authenticatedRequest.get('/auth/verify').expect(401);
    });
  });

  describe('GET /auth/verified', () => {
    it('should check user verification and return response', async () => {
      const response = await authenticatedRequest.get('/auth/verified').expect(200);

      expect(authService.checkVerification).toHaveBeenCalledWith(mockedUserContext);
      expect(response.body).toBeDefined();
    });
  });
});
