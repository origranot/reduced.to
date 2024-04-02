import { Module, DynamicModule } from '@nestjs/common';
import { SafeUrlService } from './safe-url.service';
import { GoogleSafeBrowsingChecker } from './checkers/google-safe-browsing.checker';
import { AppConfigService } from '@reduced.to/config';

@Module({})
export class SafeUrlModule {
  static forRootAsync(): DynamicModule {
    return {
      module: SafeUrlModule,
      imports: [],
      providers: [
        {
          provide: GoogleSafeBrowsingChecker,
          useFactory: (configService: AppConfigService) => {
            const apiKey = configService.getConfig().safeUrl.googleSafeBrowsing.apiKey;
            return new GoogleSafeBrowsingChecker(apiKey);
          },
          inject: [AppConfigService],
        },
        {
          provide: 'CHECKERS',
          useFactory: (googleSafeBrowsingChecker: GoogleSafeBrowsingChecker) => {
            return [googleSafeBrowsingChecker];
          },
          inject: [GoogleSafeBrowsingChecker],
        },
        SafeUrlService,
      ],
      exports: [SafeUrlService],
    };
  }
}
