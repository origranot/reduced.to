import { BadRequestException, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AppConfigService } from '@reduced.to/config';
import { AuthService } from '../auth.service';
import { ProviderType } from '@reduced.to/prisma';
import { UsersService } from '../../core/users/users.service';
import { setAuthCookies } from '../utils/cookies';
import { GoogleOAuthGuard } from '../guards/google-oauth.guard';
import { PROFILE_PICTURE_PREFIX, StorageService } from '../../storage/storage.service';

@Controller({
  path: 'auth/providers',
  version: '1',
})
export class ProvidersController {
  constructor(
    private readonly configService: AppConfigService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly storageService: StorageService
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
        profilePicture: req.user.picture,
        provider: ProviderType.GOOGLE,
      });
    }

    if (req.user.picture && this.configService.getConfig().storage.enable) {
      const imagePath = `${PROFILE_PICTURE_PREFIX}/${user.id}`;
      if (!this.storageService.exists(imagePath)) {
        await this.storageService.uploadImageFromUrl(req.user.picture, imagePath);
      }
    }

    const domain = this.configService.getConfig().front.domain;
    const urlPrefix = this.configService.getConfig().general.env === 'production' ? `https://${domain}` : `http://${domain}:4200`;

    const tokens = await this.authService.generateTokens(user);
    setAuthCookies(res, domain, tokens);
    res.redirect(`${urlPrefix}/dashboard`);
  }
}
