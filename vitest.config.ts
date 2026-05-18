import { defineConfig } from 'vitest/config';
import path from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['src/**/*.spec.*'],
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
            i18n: path.resolve(import.meta.dirname, 'src/i18n/index.ts'),
            utils: path.resolve(import.meta.dirname, 'src/utils'),
            'dramaQueen/getQueenVersion': path.resolve(
                import.meta.dirname,
                'src/test/mocks/dramaQueenMock.ts'
            ),
        },
    },
});
