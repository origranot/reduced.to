import { BadRequestException, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AppConfigService } from '@reduced.to/config';
import { AuthService } from '../auth.service';
import { ProviderType } from '@reduced.to/prisma';
import { UsersService } from '../../core/users/users.service';
import { setAuthCookies, setCookie } from '../utils/cookies';
import { GoogleOAuthGuard } from '../guards/google-oauth.guard';

@Controller({
  path: 'auth/providers',
  version: '1',
})
export class ProvidersController {
  constructor(
    private readonly configService: AppConfigService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleLogin() {
    // Guard will handle the login
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleLoginCallback(@Req() req: any, @Res() res: Response) {
    if (!req.user) {
      throw new BadRequestException('User is not exists in request');
    }

    let user = await this.usersService.findByEmail(req.user.email);

    if (!user) {
      user = await this.authService.signup({
        name: req.user.fullName,
        email: req.user.email,
        password: req.user.providerId,
        provider: ProviderType.GOOGLE,
      });
    }

    const domain = this.configService.getConfig().front.domain;
    const urlPrefix = this.configService.getConfig().general.env === 'production' ? `https://${domain}` : `http://${domain}:4200`;

    const tokens = await this.authService.generateTokens(user);
    setAuthCookies(res, domain, tokens);
    res.redirect(`${urlPrefix}/dashboard`);
  }
}
