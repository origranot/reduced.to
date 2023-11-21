import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from '@reduced.to/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(appConfigService: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let token = req.cookies.accessToken;
          if (!token && req.headers.authorization) {
            // Assuming the token is prefixed with 'Bearer '
            const parts = req.headers.authorization.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
              token = parts[1];
            }
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: appConfigService.getConfig().jwt.accessSecret,
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    return { id: payload.id, email: payload.email, role: payload.role, verified: payload.verified };
  }
}
