import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Rule } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.user({ email: username });
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.name,
      rule: user.rule,
      iss: 'reduced.to',
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(signupDto: SignupDto) {
    const user = await this.usersService.user({ email: signupDto.email });
    if (user) {
      throw new ConflictException();
    }

    return this.usersService.create({
      name: signupDto.name || null,
      email: signupDto.email,
      password: signupDto.password,
      rule: Rule.USER,
      verified: false,
    });
  }
}
