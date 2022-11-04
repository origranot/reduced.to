import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigFactory } from '@nestjs/config';

export const configFactory: ConfigFactory<{ config: IConfiguration }> = () => {
  return {
    config: {
      app: {
        port: +process.env.APP_PORT || 3000,
      },
      rateLimit: {
        ttl: +process.env.RATE_LIMIT_TTL || 60,
        limit: +process.env.RATE_LIMIT_COUNT || 10,
      },
      jwt: {
        secret: process.env.JWT_SECRET,
      },
      novu: {
        apiKey: process.env.NOVU_API_KEY,
      },
    },
  };
};

export interface AppConfig {
  port: number;
}

export interface RateLimitConfig {
  ttl: number;
  limit: number;
}

export interface JWTConfig {
  secret: string;
}

export interface NovuConfig {
  apiKey: string;
}

export interface IConfiguration {
  app: AppConfig;
  rateLimit: RateLimitConfig;
  jwt: JWTConfig;
  novu: NovuConfig;
}
