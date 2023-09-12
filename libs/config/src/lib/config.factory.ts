import { ConfigFactory } from '@nestjs/config';
import { LOG_LEVEL } from '@origranot/ts-logger';

export const configFactory: ConfigFactory<{ config: Configuration }> = () => {
  return {
    config: {
      general: {
        backendPort: +process.env.BACKEND_APP_PORT || 3000,
        frontendPort: +process.env.FRONTEND_APP_PORT || 5173,
        env: process.env.NODE_ENV || 'development',
      },
      logger: {
        console: {
          threshold: LOG_LEVEL[process.env.LOGGER_CONSOLE_THRESHOLD] || LOG_LEVEL.INFO,
        },
      },
      front: {
        domain: process.env.DOMAIN || 'localhost',
        clientSideApiDomain: process.env.CLIENTSIDE_API_DOMAIN || 'http://localhost:3000',
        apiDomain: process.env.API_DOMAIN || 'http://localhost:3000',
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
        ttl: +process.env.REDIS_TTL || 1000 * 60 * 60 * 24 * 7, // 7 days in ms
      },
      jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'secret',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'secret',
      },
      novu: {
        apiKey: process.env.NOVU_API_KEY,
      },
    },
  };
};

export interface GeneralConfig {
  backendPort: number;
  frontendPort: number;
  env: string;
}

export interface LoggerConfig {
  console: {
    threshold: LOG_LEVEL;
  };
}

export interface FrontConfig {
  domain: string;
  clientSideApiDomain: string;
  apiDomain: string;
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
  general: GeneralConfig;
  logger: LoggerConfig;
  front: FrontConfig;
  rateLimit: RateLimitConfig;
  redis: RedisConfig;
  jwt: JWTConfig;
  novu: NovuConfig;
}
