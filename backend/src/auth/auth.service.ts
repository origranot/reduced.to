import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AppConfigService } from '../config/config.service';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { UserContext } from './interfaces/user-context';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return null;
    }

    const verified = await bcrypt.compare(password, user.password);
    if (verified) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    return this.generateTokens(user);
  }

  async signup(signupDto: SignupDto): Promise<UserContext> {
    const hash = await bcrypt.hash(signupDto.password, 10);

    const userInformation = {
      name: signupDto.name,
      email: signupDto.email,
    };

    return this.prisma.user.create({
      data: {
        ...userInformation,
        password: hash,
        role: Role.USER,
        verificationToken: this.jwtService.sign(userInformation, {
          expiresIn: '1d',
        }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        refreshToken: true,
        role: true,
        verificationToken: true,
        verified: true,
      },
    });
  }

  async verify(user: UserContext): Promise<{ verified: boolean }> {
    const fetchedUser = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (!fetchedUser || !fetchedUser.verificationToken) {
      throw new UnauthorizedException();
    }

    const updatedUser = await this.prisma.user.update({
      where: { email: user.email },
      data: {
        verified: true,
        verificationToken: null,
      },
    });

    return { verified: updatedUser.verified };
  }

  async checkVerification({ id }: UserContext) {
    const fetchedUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!fetchedUser) {
      throw new UnauthorizedException();
    }

    return { verified: fetchedUser.verified };
  }

  async refreshTokens(user: any) {
    return this.generateTokens(user);
  }

  async validateRefreshToken(userId: string, refreshToken: string): Promise<any> {
    if (!refreshToken) {
      return false;
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return null;
    }

    const verified = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!verified) {
      return null;
    }

    return user;
  }

  async generateTokens(user: UserContext) {
    const tokens = {
      accessToken: this.generateToken(user),
      refreshToken: this.generateToken(
        user,
        '7d',
        this.appConfigService.getConfig().jwt.refreshSecret
      ),
    };

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
      },
    });

    return tokens;
  }

  generateToken(user: UserContext, expiresIn?: string, secret?: string) {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      verified: user.verified,
      iss: 'reduced.to',
    };

    return this.jwtService.sign(payload, {
      ...(expiresIn && { expiresIn }),
      ...(secret && { secret }),
    });
  }
}
