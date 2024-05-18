/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the Express HTTP server when building for production.
 *
 * Learn more about Node.js server integrations here:
 * - https://qwik.builder.io/docs/deployments/node/
 *
 */
import { createQwikCity, type PlatformNode } from '@builder.io/qwik-city/middleware/node';
import qwikCityPlan from '@qwik-city-plan';
import { manifest } from '@qwik-client-manifest';
import render from './entry.ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { IncomingMessage } from 'node:http';
import { Http2ServerRequest } from 'node:http2';
import bodyParser from 'body-parser';

declare global {
  // eslint-disable-next-line
  interface QwikCityPlatform extends PlatformNode {}
}

// Directories where the static assets are located
const distDir = join(fileURLToPath(import.meta.url), '..', '..', 'client');
const buildDir = join(distDir, 'build');

// Allow for dynamic port
const PORT = process.env.FRONTEND_APP_PORT ?? 5000;

// Create the Qwik City Node middleware
const { router, notFound } = createQwikCity({
  render,
  qwikCityPlan,
  manifest,
  getClientConn: (request: IncomingMessage | Http2ServerRequest) => {
    // We need to override the default getClientConn function to get the client IP address from the request headers (x-forwarded-for or x-real-ip)
    return {
      ip:
        (request.headers['x-client-ip'] as string) ||
        (request.headers['x-real-ip'] as string) ||
        (request.headers['x-forwarded-for'] as string),
      country: undefined,
    };
  },
});

// Create the express server
// https://expressjs.com/
const app = express();

// Enable gzip compression
// app.use(compression());

// Static asset handlers
// https://expressjs.com/en/starter/static-files.html
app.use(`/build`, express.static(buildDir, { immutable: true, maxAge: '1y' }));
app.use(express.static(distDir, { redirect: false }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

// Use Qwik City's page and endpoint request handler
app.use(router);

// Use Qwik City's 404 handler
app.use(notFound);

// Start the express server
app.listen(PORT, () => {
  /* eslint-disable */
  console.log(`Server started at port ${PORT}!`);
});
