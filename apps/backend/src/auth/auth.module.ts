import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfigService } from '@rt/config';
import { NovuModule } from '@rt/backend/novu/novu.module';
import { NovuService } from '@rt/backend/novu/novu.service';
import { PrismaModule } from '@rt/prisma';
import { AuthController } from '@rt/backend/auth/auth.controller';
import { AuthService } from '@rt/backend/auth/auth.service';
import { JwtRefreshStrategy } from '@rt/backend/auth/strategies/jwt-refresh.strategy';
import { JwtStrategy } from '@rt/backend/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@rt/backend/auth/strategies/local.strategy';
import { VerifyStrategy } from '@rt/backend/auth/strategies/verify.strategy';
import { GoogleStrategy } from '@rt/backend/auth/strategies/google.strategy';
import { ProvidersController } from './providers/providers.controller';
import { UsersModule } from '@rt/backend/core/users/users.module';
import { StorageModule } from '@rt/backend/storage/storage.module';
import { StorageService } from '@rt/backend/storage/storage.service';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        secret: config.getConfig().auth.jwt.accessSecret,
        signOptions: { expiresIn: '5m' },
      }),
    }),
    NovuModule,
    StorageModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController, ProvidersController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy, VerifyStrategy, GoogleStrategy, NovuService, StorageService],
  exports: [AuthService],
})
export class AuthModule {}
