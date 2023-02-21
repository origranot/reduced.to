import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Rule } from '@prisma/client';
import * as argon2 from 'argon2';
import { AppConfigService } from 'src/config/config.service';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';

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

    const verified = await argon2.verify(user.password, password);
    if (verified) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    return this.generateTokens(user);
  }

  async signup(signupDto: SignupDto) {
    const hash = await argon2.hash(signupDto.password);

    const userInformation = {
      name: signupDto.name,
      email: signupDto.email,
    };

    return this.prisma.user.create({
      data: {
        ...userInformation,
        password: hash,
        rule: Rule.USER,
        verificationToken: this.jwtService.sign(userInformation, {
          expiresIn: '1d',
        }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        refreshToken: true,
        rule: true,
        verificationToken: true,
        verified: true,
      },
    });
  }

  async verify(user: any) {
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

  async checkVerification(user: any) {
    const fetchedUser = await this.prisma.user.findUnique({
      where: {
        id: user.userId,
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

    const verified = await argon2.verify(user.refreshToken, refreshToken);
    if (!verified) {
      return null;
    }

    return user;
  }

  async generateTokens(user: any) {
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
        refreshToken: await argon2.hash(tokens.refreshToken),
      },
    });

    return tokens;
  }

  generateToken(user: any, expiresIn?: string, secret?: string) {
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.name,
      rule: user.rule,
      iss: 'reduced.to',
    };

    return this.jwtService.sign(payload, {
      ...(expiresIn && { expiresIn }),
      ...(secret && { secret }),
    });
  }
}
