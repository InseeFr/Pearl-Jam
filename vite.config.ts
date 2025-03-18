import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import federation from '@originjs/vite-plugin-federation';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { viteEnvs } from 'vite-envs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    include: ['src/**/*.spec.*'],
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: [
        'playwright.config.ts',
        'vite.config.js',
        'node_modules/',
        'src/setupTests.js',
        'tests/',
        'playwright-report/',
        'build/',
        'src/**/*.spec.*',
      ],
    },
  },
  resolve: {
    alias: {
      i18n: resolve(__dirname, 'src/i18n/index.ts'),
      utils: resolve(__dirname, 'src/utils'),
    },
  },
  build: {
    outDir: 'build',
    target: 'esnext',
  },
  plugins: [
    tsconfigPaths(),
    react(),
    federation({
      name: 'Pearl',
      remotes: {
        dramaQueen: {
          external: "Promise.resolve(import.meta.env.VITE_QUEEN_URL + '/assets/remoteEntry.js')",
          externalType: 'promise',
        },
      },
    }),
    VitePWA({
      injectRegister: null,
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.js',
      manifest: {
        short_name: 'Pearl',
        name: 'Organisation de la collecte des questionnaire en face à face',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '32x32',
            type: 'image/x-icon',
          },
          {
            src: 'static/images/insee.png',
            sizes: '326x378',
            type: 'image/png',
          },
          {
            src: 'static/images/logo-insee-header.png',
            sizes: '270x274',
            type: 'image/png',
          },
        ],
        start_url: '.',
        display: 'standalone',
        theme_color: '#000000',
        background_color: '#ffffff',
      },
    }),
  ],
});
