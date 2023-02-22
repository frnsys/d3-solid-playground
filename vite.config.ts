import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  base: './', // Use relative paths for asset build paths
  plugins: [solidPlugin()],
  server: {
    port: 8080,
  },
  build: {
    target: 'esnext',
  },
});