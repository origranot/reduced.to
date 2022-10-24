import { qwikCity } from '@builder.io/qwik-city/vite';
import { qwikReact } from '@builder.io/qwik-react';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    ssr: { target: 'node', format: 'cjs' },
    plugins: [qwikCity(), qwikVite(), tsconfigPaths(), qwikReact()],
  };
});
