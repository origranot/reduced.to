import { ConfigFactory } from '@nestjs/config';
import { LOG_LEVEL } from '@origranot/ts-logger';

export const configFactory: ConfigFactory<{ config: Configuration }> = () => {
  return {
    config: {
      app: {
        port: +process.env.APP_PORT || 3000,
      },
      logger: {
        console: {
          threshold: LOG_LEVEL[process.env.LOGGER_CONSOLE_THRESHOLD] || LOG_LEVEL.INFO,
        },
      },
      front: {
        domain: process.env.FRONT_DOMAIN || 'http://localhost:5173',
      },
      rateLimit: {
        ttl: +process.env.RATE_LIMIT_TTL || 60,
        limit: +process.env.RATE_LIMIT_COUNT || 10,
      },
      redis: {
        enable: process.env.REDIS_ENABLE === 'true' || false,
        host: process.env.REDIS_HOST || 'localhost',
        port: +process.env.REDIS_PORT || 4000,
        password: process.env.REDIS_PASSWORD || 'password',
        ttl: +process.env.REDIS_TTL || 60 * 60 * 24 * 7, // Seconds
      },
      jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
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

export interface LoggerConfig {
  console: {
    threshold: LOG_LEVEL;
  };
}

export interface FrontConfig {
  domain: string;
}

export interface RateLimitConfig {
  ttl: number;
  limit: number;
}

export interface RedisConfig {
  enable: boolean;
  host: string;
  port: number;
  password: string;
  ttl: number;
}

export interface JWTConfig {
  accessSecret: string;
  refreshSecret: string;
}

export interface NovuConfig {
  apiKey: string;
}

export interface Configuration {
  app: AppConfig;
  logger: LoggerConfig;
  front: FrontConfig;
  rateLimit: RateLimitConfig;
  redis: RedisConfig;
  jwt: JWTConfig;
  novu: NovuConfig;
}
