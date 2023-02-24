import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppConfigService } from 'src/config/config.service';
import { NovuService } from 'src/novu/novu.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { VerifyAuthGuard } from './guards/verify.guard';
import { UserContext } from './interfaces/user-context';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly novuService: NovuService,
    private readonly userService: UserService,
    private readonly appConfigService: AppConfigService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response) {
    const tokens = await this.authService.login(req.user as UserContext);
    const domain = process.env.NODE_ENV === 'production' ? '.reduced.to' : 'localhost';
    res.cookie('accessToken', tokens.accessToken, {
      expires: new Date(new Date().getTime() + 15 * 60 * 1000), //15 min
      domain,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), //7 days
      domain,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
    });

    res.send({ user: req.user });
  }

  @Post('/logout')
  async logout(@Res() res: any) {
    res.clearCookie('accessToken');
    res.send({ success: true });
  }

  @Post('/signup')
  async signup(@Res() res: Response, @Body() signupDto: SignupDto) {
    const user = await this.authService.signup(signupDto);
    await this.novuService.sendVerificationEmail(user);

    const tokens = await this.authService.login(user);
    const domain = process.env.NODE_ENV === 'production' ? '.reduced.to' : 'localhost';
    res.cookie('accessToken', tokens.accessToken, {
      expires: new Date(new Date().getTime() + 15 * 60 * 1000), //15 min
      domain,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), //7 days
      domain,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
    });

    res.send({ user: user });
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('/refresh')
  async refresh(@Req() req: Request) {
    return this.authService.refreshTokens(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check-auth')
  checkAuth(@Req() req) {
    return { user: req.user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/resend')
  async resendVerification(@Req() req: Request) {
    const reqUser: any = req.user;
    const user = await this.userService.get(reqUser.userId);
    return this.novuService.sendVerificationEmail(user);
  }

  @UseGuards(VerifyAuthGuard)
  @Get('/verify')
  async verify(@Req() req: Request) {
    return this.authService.verify(req.user as UserContext);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/verified')
  async verified(@Req() req: Request) {
    return this.authService.checkVerification(req.user as UserContext);
  }
}
