import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/setupTests.js'],
    },
  },
  build: { outDir: 'build' },
  plugins: [
    tsconfigPaths(),
    react(),
    VitePWA({
      injectRegister: 'null',
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
