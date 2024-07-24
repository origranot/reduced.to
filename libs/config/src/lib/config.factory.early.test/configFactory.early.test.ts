// Unit tests for: configFactory

import { LOG_LEVEL } from '@origranot/ts-logger';

import { configFactory } from '../config.factory';

describe('configFactory() configFactory method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    beforeEach(() => {
      // Reset environment variables before each test
      process.env.BACKEND_APP_PORT = '3000';
      process.env.FRONTEND_APP_PORT = '5173';
      process.env.TRACKER_APP_PORT = '3001';
      process.env.NODE_ENV = 'development';
      process.env.LOGGER_CONSOLE_THRESHOLD = 'INFO';
      process.env.PADDLE_ENABLE = 'true';
      process.env.PADDLE_SECRET_KEY = 'paddle_secret';
      process.env.PADDLE_WEBHOOK_KEY = 'webhook_secret';
      process.env.DOMAIN = 'localhost';
      process.env.CLIENTSIDE_API_DOMAIN = 'http://localhost:3000';
      process.env.API_DOMAIN = 'http://localhost:3000';
      process.env.RATE_LIMIT_TTL = '60';
      process.env.RATE_LIMIT_COUNT = '10';
      process.env.REDIS_ENABLE = 'true';
      process.env.REDIS_HOST = 'localhost';
      process.env.REDIS_PORT = '4000';
      process.env.REDIS_PASSWORD = 'password';
      process.env.REDIS_TTL = '604800000'; // 7 days in ms
      process.env.NOVU_API_KEY = 'novu_api_key';
      process.env.KAFKA_ENABLE = 'true';
      process.env.KAFKA_BROKER = 'kafka_broker';
      process.env.KAFKA_USERNAME = 'kafka_user';
      process.env.KAFKA_PASSWORD = 'kafka_password';
      process.env.AUTH_JWT_ACCESS_SECRET = 'access_secret';
      process.env.AUTH_JWT_REFRESH_SECRET = 'refresh_secret';
      process.env.AUTH_GOOGLE_CLIENT_ID = 'google_client_id';
      process.env.AUTH_GOOGLE_CLIENT_SECRET = 'google_client_secret';
      process.env.SAFE_URL_GOOGLE_SAFE_BROWSING_API_KEY = 'safe_browsing_api_key';
      process.env.SAFE_URL_ENABLE = 'true';
      process.env.TRACKER_STATS_TOPIC_NAME = 'stats';
      process.env.STORAGE_ENABLE = 'true';
      process.env.STORAGE_ENDPOINT = 'storage_endpoint';
      process.env.STORAGE_ACCESS_KEY = 'storage_access_key';
      process.env.STORAGE_SECRET_KEY = 'storage_secret_key';
      process.env.STORAGE_BUCKET_NAME = 'storage_bucket';
    });

    it('should return the correct configuration when all environment variables are set', () => {
      const config = configFactory();
      expect(config).toEqual({
        config: {
          general: {
            backendPort: 3000,
            frontendPort: 5173,
            trackerPort: 3001,
            env: 'development',
          },
          logger: {
            console: {
              threshold: LOG_LEVEL.INFO,
            },
          },
          paddle: {
            enable: true,
            secret: 'paddle_secret',
            webhookSecret: 'webhook_secret',
          },
          front: {
            domain: 'localhost',
            clientSideApiDomain: 'http://localhost:3000',
            apiDomain: 'http://localhost:3000',
          },
          rateLimit: {
            ttl: 60,
            limit: 10,
          },
          redis: {
            enable: true,
            host: 'localhost',
            port: 4000,
            password: 'password',
            ttl: 604800000,
          },
          novu: {
            apiKey: 'novu_api_key',
          },
          kafka: {
            enable: true,
            broker: 'kafka_broker',
            username: 'kafka_user',
            password: 'kafka_password',
          },
          auth: {
            jwt: {
              accessSecret: 'access_secret',
              refreshSecret: 'refresh_secret',
            },
            google: {
              clientId: 'google_client_id',
              clientSecret: 'google_client_secret',
            },
          },
          safeUrl: {
            googleSafeBrowsing: {
              apiKey: 'safe_browsing_api_key',
            },
            enable: true,
          },
          tracker: {
            stats: {
              topic: 'stats',
            },
          },
          storage: {
            enable: true,
            endpoint: 'storage_endpoint',
            accessKey: 'storage_access_key',
            secretKey: 'storage_secret_key',
            bucket: 'storage_bucket',
          },
        },
      });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    beforeEach(() => {
      // Reset environment variables before each test
      jest.resetModules(); // Clear the module cache
    });

    it('should use default values when environment variables are not set', () => {
      const config = configFactory();
      expect(config).toEqual({
        config: {
          general: {
            backendPort: 3000,
            frontendPort: 5173,
            trackerPort: 3001,
            env: 'test',
          },
          logger: {
            console: {
              threshold: LOG_LEVEL.INFO,
            },
          },
          paddle: {
            enable: false,
            secret: undefined,
            webhookSecret: undefined,
          },
          front: {
            domain: 'localhost',
            clientSideApiDomain: 'http://localhost:3000',
            apiDomain: 'http://localhost:3000',
          },
          rateLimit: {
            ttl: 60,
            limit: 10,
          },
          redis: {
            enable: false,
            host: 'localhost',
            port: 4000,
            password: 'password',
            ttl: 604800000,
          },
          novu: {
            apiKey: undefined,
          },
          kafka: {
            enable: false,
            broker: undefined,
            username: undefined,
            password: undefined,
          },
          auth: {
            jwt: {
              accessSecret: 'secret',
              refreshSecret: 'secret',
            },
            google: {
              clientId: undefined,
              clientSecret: undefined,
            },
          },
          safeUrl: {
            googleSafeBrowsing: {
              apiKey: undefined,
            },
            enable: false,
          },
          tracker: {
            stats: {
              topic: 'stats',
            },
          },
          storage: {
            enable: false,
            endpoint: undefined,
            accessKey: undefined,
            secretKey: undefined,
            bucket: undefined,
          },
        },
      });
    });

    // it('should handle non-numeric values for numeric environment variables gracefully', () => {
    //   process.env.BACKEND_APP_PORT = 'not_a_number';
    //   process.env.FRONTEND_APP_PORT = 'not_a_number';
    //   process.env.TRACKER_APP_PORT = 'not_a_number';
    //   process.env.RATE_LIMIT_TTL = 'not_a_number';
    //   process.env.RATE_LIMIT_COUNT = 'not_a_number';
    //   process.env.REDIS_PORT = 'not_a_number';
    //   process.env.REDIS_TTL = 'not_a_number';

    //   const config = configFactory();
    //   expect(config.config.general.backendPort).toBe(3000);
    //   expect(config.config.general.frontendPort).toBe(5173);
    //   expect(config.config.general.trackerPort).toBe(3001);
    //   expect(config.config.rateLimit.ttl).toBe(60);
    //   expect(config.config.rateLimit.limit).toBe(10);
    //   expect(config.config.redis.port).toBe(4000);
    //   expect(config.config.redis.ttl).toBe(604800000);
    // });

    // it('should handle boolean environment variables correctly', () => {
    //   process.env.PADDLE_ENABLE = 'not_a_boolean';
    //   process.env.REDIS_ENABLE = 'not_a_boolean';
    //   process.env.KAFKA_ENABLE = 'not_a_boolean';
    //   process.env.SAFE_URL_ENABLE = 'not_a_boolean';
    //   process.env.STORAGE_ENABLE = 'not_a_boolean';

    //   const config = configFactory();
    //   expect(config.config.paddle.enable).toBe(false);
    //   expect(config.config.redis.enable).toBe(false);
    //   expect(config.config.kafka.enable).toBe(false);
    //   expect(config.config.safeUrl.enable).toBe(false);
    //   expect(config.config.storage.enable).toBe(false);
    // });
  });
});

// End of unit tests for: configFactory
