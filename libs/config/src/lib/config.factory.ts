import { ConfigFactory } from '@nestjs/config';
import { LOG_LEVEL } from '@origranot/ts-logger';

export const configFactory: ConfigFactory<{ config: Configuration }> = () => {
  return {
    config: {
      general: {
        backendPort: +process.env.BACKEND_APP_PORT || 3000,
        frontendPort: +process.env.FRONTEND_APP_PORT || 5173,
        trackerPort: +process.env.TRACKER_APP_PORT || 3001,
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
      novu: {
        apiKey: process.env.NOVU_API_KEY,
      },
      kafka: {
        enable: process.env.KAFKA_ENABLE === 'true' || false,
        broker: process.env.KAFKA_BROKER,
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
      },
      auth: {
        jwt: {
          accessSecret: process.env.AUTH_JWT_ACCESS_SECRET || 'secret',
          refreshSecret: process.env.AUTH_JWT_REFRESH_SECRET || 'secret',
        },
        google: {
          clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
          clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
        },
      },
      safeUrl: {
        googleSafeBrowsing: {
          apiKey: process.env.SAFE_URL_GOOGLE_SAFE_BROWSING_API_KEY,
        },
        enable: process.env.SAFE_URL_ENABLE === 'true' || false,
      },
      tracker: {
        stats: {
          topic: process.env.TRACKER_STATS_TOPIC_NAME || 'stats',
        },
      },
      storage: {
        enable: process.env.STORAGE_ENABLE === 'true' || false,
        endpoint: process.env.STORAGE_ENDPOINT,
        accessKey: process.env.STORAGE_ACCESS_KEY,
        secretKey: process.env.STORAGE_SECRET_KEY,
        bucket: process.env.STORAGE_BUCKET_NAME,
      },
    },
  };
};

export interface GeneralConfig {
  backendPort: number;
  frontendPort: number;
  trackerPort: number;
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

export interface NovuConfig {
  apiKey: string;
}

export interface KafkaConfig {
  enable: boolean;
  broker: string;
  username: string;
  password: string;
}

export interface AuthConfig {
  google: {
    clientId: string;
    clientSecret: string;
  };
  jwt: {
    accessSecret: string;
    refreshSecret: string;
  };
}

export interface TrackerConfig {
  stats: {
    topic: string;
  };
}

export interface SafeUrlConfig {
  googleSafeBrowsing: {
    apiKey: string;
  };
  enable: boolean;
}

export interface StorageConfig {
  enable: boolean;
  endpoint: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
}

export interface Configuration {
  general: GeneralConfig;
  logger: LoggerConfig;
  front: FrontConfig;
  rateLimit: RateLimitConfig;
  redis: RedisConfig;
  novu: NovuConfig;
  kafka: KafkaConfig;
  auth: AuthConfig;
  safeUrl: SafeUrlConfig;
  tracker: TrackerConfig;
  storage: StorageConfig;
}
