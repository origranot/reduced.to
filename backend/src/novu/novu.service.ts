import { Inject, Injectable } from '@nestjs/common';
import { Novu } from '@novu/node';
import { User } from '@prisma/client';
import { AppConfigService } from 'src/config/config.service';
import { UserContext } from '../auth/interfaces/user-context';
import { NOVU_INJECTION_TOKEN } from './novu.module';

@Injectable()
export class NovuService {
  constructor(
    @Inject(NOVU_INJECTION_TOKEN) private readonly novu: Novu,
    private readonly appConfigService: AppConfigService
  ) {}

  async sendVerificationEmail(user: UserContext) {
    const verificationUrl = `${this.appConfigService.getConfig().front.domain}/register/verify/${
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
  }
}
