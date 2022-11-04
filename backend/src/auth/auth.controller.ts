import { Body, Controller, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { NOVU_INJECTION_TOKEN } from '../novu/novu.module';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { Novu } from '@novu/node';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(NOVU_INJECTION_TOKEN) private readonly novu: Novu
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('/signup')
  async signup(@Body() signupDto: SignupDto) {
    const user = await this.authService.signup(signupDto);

    await this.novu.trigger('new-user', {
      to: {
        subscriberId: user.id,
        email: user.email,
      },
      payload: {
        name: user.name,
        verification_url: 'https://reduced.to', //TODO: need to implement
      },
    });

    return user;
  }
}
