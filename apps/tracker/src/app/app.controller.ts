import { Controller } from '@nestjs/common';
import { AppConfigService } from '@reduced.to/config';

@Controller()
export class AppController {
  constructor(config: AppConfigService) {

  }
}
