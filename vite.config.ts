import { defineConfig } from 'vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackRouter({
      routesDirectory: 'src/app',
      generatedRouteTree: 'src/routeTree.gen.ts',
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),
  ],
});
