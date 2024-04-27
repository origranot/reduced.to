import { Inject, Injectable } from '@nestjs/common';
import { STORAGE_INJECTION_TOKEN } from './storage.module';
import { PutObjectCommandInput, S3 } from '@aws-sdk/client-s3';
import { AppConfigService } from '@reduced.to/config';
import { AppLoggerService } from '@reduced.to/logger';

@Injectable()
export class StorageService {
  constructor(
    @Inject(STORAGE_INJECTION_TOKEN) private readonly s3Client: S3,
    private readonly config: AppConfigService,
    private readonly logger: AppLoggerService
  ) {}

  async uploadImageFromUrl(imageUrl: string, name: string) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = response.headers.get('content-type');

      const data = await this.uploadImage({
        name: name,
        file: buffer,
        contentType,
      });
      return data;
    } catch (error) {
      this.logger.error('Error uploading image', error);
    }
  }

  async uploadImage({ name, file, contentType }: { name: string; file: Buffer; contentType?: string }) {
    const params: PutObjectCommandInput = {
      Bucket: this.config.getConfig().storage.bucket,
      Key: name,
      Body: file,
      ACL: 'public-read',
      ...(contentType && { ContentType: contentType }),
    };

    const data = await this.s3Client.putObject(params);
    return data;
  }

  async delete(name: string) {
    const params: PutObjectCommandInput = {
      Bucket: this.config.getConfig().storage.bucket,
      Key: name,
    };

    const data = await this.s3Client.deleteObject(params);
    return data;
  }

  async exists(name: string) {
    const params: PutObjectCommandInput = {
      Bucket: this.config.getConfig().storage.bucket,
      Key: name,
    };

    try {
      await this.s3Client.headObject(params);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const PROFILE_PICTURE_PREFIX = 'profile-pictures';
