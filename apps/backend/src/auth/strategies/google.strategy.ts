import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@rt/config';
import { UsersService } from '@rt/backend/core/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: AppConfigService, private readonly usersService: UsersService) {
    const domain = configService.getConfig().front.domain;
    const urlPrefix = configService.getConfig().general.env === 'production' ? `https://${domain}` : `http://${domain}:3000`;

    super({
      clientID: configService.getConfig().auth.google.clientId,
      clientSecret: configService.getConfig().auth.google.clientSecret,
      callbackURL: `${urlPrefix}/api/v1/auth/providers/google/callback`,
      scope: ['email', 'profile'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos, id } = profile;

    if (!emails[0].verified) {
      return done(new Error('Email is not verified'));
    }

    const fullName = `${name?.givenName}${name?.familyName ? ` ${name?.familyName}` : ''}`;

    const user = {
      email: emails[0].value,
      fullName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
      providerId: id,
    };
    done(null, user);
  }
}
