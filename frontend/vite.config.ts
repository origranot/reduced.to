import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { qwikReact } from "@builder.io/qwik-react";

export default defineConfig(() => {
  return {
    ssr: { target: "node", format: "cjs" },
    plugins: [qwikCity(), qwikVite(), tsconfigPaths(), qwikReact()],
  };
});
