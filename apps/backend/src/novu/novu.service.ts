import { Inject, Injectable } from '@nestjs/common';
import { Novu } from '@novu/node';
import { UserContext } from '../auth/interfaces/user-context';
import { AppConfigService } from '@reduced.to/config';
import { NOVU_INJECTION_TOKEN } from './novu.module';
import { Configuration } from '@reduced.to/config';

@Injectable()
export class NovuService {
  private config: Configuration;
  constructor(@Inject(NOVU_INJECTION_TOKEN) private readonly novu: Novu, private readonly appConfigService: AppConfigService) {
    this.config = this.appConfigService.getConfig();
  }

  async sendVerificationEmail(user: UserContext) {
    const domain = process.env.NODE_ENV === 'production' ? `https://${this.config.front.domain}` : `http://${this.config.front.domain}:${this.config.general.frontendPort}`;
    const verificationUrl = `${this.appConfigService.getConfig().front.domain}/register/verify/${user.verificationToken}`;

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
