import { BadRequestException, Controller, Get, Inject, Req, Res, UseGuards, forwardRef } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AppConfigService } from '@reduced.to/config';
import { AuthService } from '../auth.service';
import { ProviderType } from '@reduced.to/prisma';
import { UsersService } from '../../core/users/users.service';
import { setAuthCookies } from '../utils/cookies';

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
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
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
    res = setAuthCookies(res, domain, tokens);
    res.redirect(`${urlPrefix}/dashboard`);
  }
}
