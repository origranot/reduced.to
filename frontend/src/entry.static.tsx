import { qwikCityGenerate } from '@builder.io/qwik-city/static/node';
import { join } from 'path';
import { fileURLToPath } from 'url';
import render from './entry.ssr';

// Execute Qwik City Static Site Generator
qwikCityGenerate(render, {
  origin: 'https://reduced.to',
  outDir: join(fileURLToPath(import.meta.url), '..', '..', 'dist'),
});
