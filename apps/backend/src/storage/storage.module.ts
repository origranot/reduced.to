import { S3 } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { AppConfigService } from '@rt/config';

export const STORAGE_INJECTION_TOKEN = 'STORAGE';

const storageFactory = {
  provide: STORAGE_INJECTION_TOKEN,
  useFactory: (config: AppConfigService) => {
    const client = new S3({
      endpoint: config.getConfig().storage.endpoint,
      region: 'us-east-1',
      credentials: {
        accessKeyId: config.getConfig().storage.accessKey,
        secretAccessKey: config.getConfig().storage.secretKey,
      },
    });

    return client;
  },
  inject: [AppConfigService],
};

@Module({
  providers: [storageFactory],
  exports: [storageFactory],
})
export class StorageModule {}
