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
      mail: {
        transport: {
          host: process.env.MAIL_SMTP_HOST,
          port: +process.env.MAIL_SMTP_PORT,
          secure: false,
          auth: {
            user: process.env.MAIL_SMTP_USER,
            pass: process.env.MAIL_SMTP_PASSWORD,
          },
          tls: { rejectUnauthorized: false },
        },
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

export interface IConfiguration {
  app: AppConfig;
  rateLimit: RateLimitConfig;
  jwt: JWTConfig;
  mail: MailerOptions;
}
