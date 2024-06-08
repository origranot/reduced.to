import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfigService } from '@reduced.to/config';
import { NovuModule } from '../novu/novu.module';
import { NovuService } from '../novu/novu.service';
import { PrismaModule } from '@reduced.to/prisma';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { VerifyStrategy } from './strategies/verify.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { ProvidersController } from './providers/providers.controller';
import { UsersModule } from '../core/users/users.module';
import { StorageModule } from '../storage/storage.module';
import { StorageService } from '../storage/storage.service';
import { BillingModule } from '../billing/billing.module';

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
    forwardRef(() => BillingModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController, ProvidersController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy, VerifyStrategy, GoogleStrategy, NovuService, StorageService],
  exports: [AuthService],
})
export class AuthModule {}
