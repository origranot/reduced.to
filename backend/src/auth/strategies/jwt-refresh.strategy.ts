import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from '../../config/config.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(appConfigService: AppConfigService, private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: appConfigService.getConfig().jwt.refreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    const id = payload.id;
    const refreshToken = request?.cookies?.refreshToken;
    const user = await this.authService.validateRefreshToken(id, refreshToken);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }
}
