import { qwikCity } from '@builder.io/qwik-city/vite';
import { qwikReact } from '@builder.io/qwik-react';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    ssr: { target: 'node', format: 'cjs' },
    plugins: [qwikCity(), qwikVite(), tsconfigPaths(), qwikReact()],
    define: {
      'process.env.API_DOMAIN': JSON.stringify(env.API_DOMAIN),
    },
  };
});
