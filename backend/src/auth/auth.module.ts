import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { NovuModule } from '../novu/novu.module';
import { VerifyStrategy } from './strategies/verify.strategy';
import { AppConfigService } from '../config/config.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        secret: config.getConfig().jwt.secret,
        signOptions: { expiresIn: '300s' },
      }),
    }),
    NovuModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, VerifyStrategy],
  exports: [AuthService],
})
export class AuthModule {}
