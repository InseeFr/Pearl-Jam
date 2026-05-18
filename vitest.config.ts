import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        environment: 'jsdom'
    },
    resolve: {
        alias: {
            'dramaQueen/getQueenVersion': path.resolve(
                __dirname,
                'src/test/mocks/dramaQueenMock.ts'
            )
        }
    }
});