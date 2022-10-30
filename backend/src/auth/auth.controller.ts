import { BadRequestException, Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LocalAuthGuard } from './guards/local.guard';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/signup')
  async signup(@Body() signupDto: SignupDto) {
    if (!signupDto.email || !signupDto.password) {
      throw new BadRequestException();
    }

    return this.authService.signup(signupDto);
  }
}
