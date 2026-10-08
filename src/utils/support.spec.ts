import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_QUEEN_VERSION, DEFAULT_SYNC_DATE } from './support';

vi.mock('../../package.json', () => ({
    version: '9.9.9'
}));

vi.mock('date-fns', () => ({
    format: vi.fn(() => '01/02/2026 12:34:56')
}));

describe('support.ts', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();

        Object.defineProperty(URL, 'createObjectURL', {
            writable: true,
            value: vi.fn(() => 'blob:test-url')
        });

        Object.defineProperty(URL, 'revokeObjectURL', {
            writable: true,
            value: vi.fn()
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getQueenVersionSafely', () => {
        // nominal case it tested in playwright

        it('should return default error message when queen version fails', async () => {
            const remote = await import('dramaQueen/getQueenVersion');
            vi.mocked(remote.default.getQueenVersion).mockImplementationOnce(() => {
                throw new Error('remote unavailable');
            });

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            const { getQueenVersionSafely } = await import('./support');

            const result = await getQueenVersionSafely();

            expect(result).toBe(DEFAULT_QUEEN_VERSION);
            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('getSupportData', () => {


        vi.mock(
            'getQueenVersionSafely',
            () => (
                () => 'Queen : v 1.2.3'
            ));

        it('should return support data with default sync date when no localStorage value', async () => {
            const { getSupportData } = await import('./support');

            const result = await getSupportData();

            expect(result).toEqual({
                currentUrl: window.location.href,
                appVersion: 'Pearl : v 9.9.9',
                queenVersion: 'Queen : v 1.2.3',
                navigatorInfo: navigator.userAgent,
                lastSyncDate: DEFAULT_SYNC_DATE
            });
        });

        it('should return support data with localStorage sync date when available', async () => {
            localStorage.setItem('LAST_SYNCH_SUCCESS_DATE', '2026-02-01 10:30:00');

            const { getSupportData } = await import('./support');

            const result = await getSupportData();

            expect(result).toEqual({
                currentUrl: window.location.href,
                appVersion: 'Pearl : v 9.9.9',
                queenVersion: 'Queen : v 1.2.3',
                navigatorInfo: navigator.userAgent,
                lastSyncDate: '2026-02-01 10:30:00'
            });
        });
    });

    describe('generateSupportFileContent', () => {
        it('should generate properly formatted support file content', async () => {
            const { generateSupportFileContent } = await import('./support');

            const result = generateSupportFileContent({
                currentUrl: 'http://localhost:3000/test',
                appVersion: 'Pearl : v 9.9.9',
                queenVersion: 'Queen : v 1.2.3',
                navigatorInfo: 'test-user-agent',
                lastSyncDate: '2026-02-01 10:30:00'
            });

            expect(result).toBe(`Support Data - 01/02/2026 12:34:56

Current URL: http://localhost:3000/test
App Version: Pearl : v 9.9.9
Queen Version: Queen : v 1.2.3
Navigator: test-user-agent
Last Sync: 2026-02-01 10:30:00`);
        });
    });

    describe('downloadSupportFile', () => {
        it('should create and download support file', async () => {
            const clickMock = vi.fn();
            const removeMock = vi.fn();

            const anchorMock = {
                href: '',
                download: '',
                click: clickMock,
                remove: removeMock
            } as unknown as HTMLAnchorElement;

            vi.spyOn(document, 'createElement').mockReturnValue(anchorMock);
            vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);

            const { downloadSupportFile } = await import('./support');

            await downloadSupportFile();

            expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
            expect(document.createElement).toHaveBeenCalledWith('a');
            expect(anchorMock.href).toBe('blob:test-url');
            expect(anchorMock.download).toBe('support.txt');
            expect(document.body.appendChild).toHaveBeenCalledWith(anchorMock);
            expect(clickMock).toHaveBeenCalled();
            expect(removeMock).toHaveBeenCalled();
            expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url');
        });
    });
});