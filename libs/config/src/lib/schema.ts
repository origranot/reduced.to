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

  // Memphis
  MEMPHIS_ENABLE: z.boolean().default(false),
  MEMPHIS_HOST: z.string(),
  MEMPHIS_USERNAME: z.string(),
  MEMPHIS_PASSWORD: z.string(),
  MEMPHIS_ACCOUNT_ID: z.string(),

  // Safe Url Library
  SAFE_URL_GOOGLE_SAFE_BROWSING_API_KEY: z.string(),

  // Auth
  AUTH_JWT_ACCESS_SECRET: z.string(),
  AUTH_JWT_REFRESH_SECRET: z.string(),
  AUTH_GOOGLE_CLIENT_ID: z.string(),
  AUTH_GOOGLE_CLIENT_SECRET: z.string(),

  // Tracker
  TRACKER_STATS_QUEUE_NAME: z.string(),
});
