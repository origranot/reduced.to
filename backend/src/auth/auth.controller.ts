import { AppConfigService } from './../config/config.service';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NOVU_INJECTION_TOKEN } from '../novu/novu.module';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { Novu } from '@novu/node';
import { VerifyAuthGuard } from './guards/verify.guard';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly config: AppConfigService,
    private readonly authService: AuthService,
    @Inject(NOVU_INJECTION_TOKEN) private readonly novu: Novu
  ) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('/signup')
  async signup(@Body() signupDto: SignupDto) {
    const user = await this.authService.signup(signupDto);

    const verificationUrl = `${this.config.getConfig().front.domain}/register/verify/${
      user.verificationToken
    }`;

    await this.novu.trigger('new-user', {
      to: {
        subscriberId: user.id,
        email: user.email,
      },
      payload: {
        name: user.name,
        verification_url: verificationUrl,
      },
    });

    return user;
  }

  @Get('/verify')
  @UseGuards(VerifyAuthGuard)
  async verify(@Request() req: any) {
    return this.authService.verify(req.user);
  }
}
