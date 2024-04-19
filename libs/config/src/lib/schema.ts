import { z } from 'zod';
export default z.object({
  // General
  BACKEND_APP_PORT: z.string(),
  FRONTEND_APP_PORT: z.string(),
  NODE_ENV: z.string().default('development'),

  // Rate limit config
  RATE_LIMIT_TTL: z.string(),
  RATE_LIMIT_COUNT: z.string(),

  // Logger
  LOGGER_CONSOLE_THRESHOLD: z.string().default('INFO'),

  // Frontend
  DOMAIN: z.string(),
  CLIENTSIDE_API_DOMAIN: z.string(),
  API_DOMAIN: z.string(),

  // Database
  DATABASE_URL: z.string(),

  // Redis
  REDIS_ENABLE: z.boolean().default(false),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASSWORD: z.string(),
  REDIS_TTL: z.string(),

  // Novu
  NOVU_API_KEY: z.string().optional(),

  // Kafka
  KAFKA_ENABLE: z.boolean().default(false),
  KAFKA_BROKER: z.string(),
  KAFKA_USERNAME: z.string(),
  KAFKA_PASSWORD: z.string(),

  // Safe Url Library
  SAFE_URL_GOOGLE_SAFE_BROWSING_API_KEY: z.string(),
  SAFE_URL_ENABLE: z.boolean().default(false),

  // Auth
  AUTH_JWT_ACCESS_SECRET: z.string(),
  AUTH_JWT_REFRESH_SECRET: z.string(),
  AUTH_GOOGLE_CLIENT_ID: z.string(),
  AUTH_GOOGLE_CLIENT_SECRET: z.string(),

  // Tracker
  TRACKER_STATS_TOPIC_NAME: z.string(),
});
