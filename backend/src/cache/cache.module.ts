import { AppCacheService } from './cache.service';
import { CacheModule, Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 0, // Unlimited time
    }),
  ],
  providers: [AppCacheService],
  exports: [AppCacheService],
})
export class AppCacheModule {}
