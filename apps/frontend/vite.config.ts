import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { qwikNxVite } from 'qwik-nx/plugins';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  console.log('env', {
    DOMAIN: env.DOMAIN,
    CLIENTSIDE_API_DOMAIN: env.CLIENTSIDE_API_DOMAIN,
    API_DOMAIN: env.API_DOMAIN,
  });

  return {
    cacheDir: '../../node_modules/.vite/apps/frontend',
    plugins: [
      qwikNxVite(),
      qwikCity(),
      qwikVite({
        client: {
          outDir: '../../dist/apps/frontend/client',
        },
        ssr: {
          outDir: '../../dist/apps/frontend/server',
        },
      }),
      tsconfigPaths({ root: '../../' }),
    ],
    define: {
      'process.env.DOMAIN': JSON.stringify(env.DOMAIN),
      'process.env.API_DOMAIN': JSON.stringify(env.API_DOMAIN),
      'process.env.CLIENTSIDE_API_DOMAIN': JSON.stringify(env.CLIENTSIDE_API_DOMAIN),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    optimizeDeps: {
      include: ['canvas-confetti'],
    },
    server: {
      fs: {
        // Allow serving files from the project root
        allow: ['../../'],
      },
    },
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
    test: {
      globals: true,
      cache: {
        dir: '../../node_modules/.vitest',
      },
      environment: 'node',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
  };
});
