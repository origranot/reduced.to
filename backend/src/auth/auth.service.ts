import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Rule } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.get({ email });
    if (!user) {
      return null;
    }

    const verified = await argon2.verify(user.password, password);
    if (verified) {
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
    const hash = await argon2.hash(signupDto.password);

    return this.usersService.create({
      name: signupDto.name,
      email: signupDto.email,
      password: hash,
      rule: Rule.USER,
    });
  }
}
