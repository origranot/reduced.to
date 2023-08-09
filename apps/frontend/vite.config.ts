import { qwikCity } from '@builder.io/qwik-city/vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths()],
    define: {
      'process.env.API_DOMAIN': JSON.stringify(env.API_DOMAIN),
      'process.env.DOMAIN': JSON.stringify(env.DOMAIN),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    optimizeDeps: {
      include: ['@auth/core', 'canvas-confetti'],
    },
  };
});
