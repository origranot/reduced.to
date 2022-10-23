import { qwikCity } from '@builder.io/qwik-city/middleware/node';
import express from 'express';
import { join } from 'path';
import { fileURLToPath } from 'url';
import render from './entry.ssr';

// Directories where the static assets are located
const distDir = join(fileURLToPath(import.meta.url), '..', '..', 'dist');
const buildDir = join(distDir, 'build');

// Create the Qwik City express middleware
const { router, notFound } = qwikCity(render);

// Allow for dynamic port
const PORT = process.env.PORT ?? 5000;

// Create the express server
const app = express();

// Static asset handlers
app.use(`/build`, express.static(buildDir, { immutable: true, maxAge: '1y' }));
app.use(express.static(distDir, { redirect: false }));

// Use Qwik City's page and endpoint request handler
app.use(router);

// Use Qwik City's 404 handler
app.use(notFound);

// Start the express server
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});
