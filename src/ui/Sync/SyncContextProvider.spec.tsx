import { render, waitFor } from '@testing-library/react';
import { PropsWithChildren, useContext, useEffect } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SyncContext, SyncContextProvider } from './SyncContextProvider';
import { NotificationState } from 'types/pearl';

const mockHealthCheck = vi.fn();
const mockSynchronizePearl = vi.fn();
const mockSynchronizeQueen = vi.fn();
const mockStoreSurveyUnitsIds = vi.fn();
const mockSaveSyncPearlData = vi.fn();
const mockAnalyseResult = vi.fn();

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}))

vi.mock('api/pearl', () => ({
    healthCheck: () => mockHealthCheck(),
}));

vi.mock('utils/synchronize/useQueenSynchronization', () => ({
    useQueenSynchronization: () => ({
        synchronizeQueen: mockSynchronizeQueen,
        queenReady: true,
        queenError: false,
    }),
}));

vi.mock('utils/synchronize/synchronizePearl', () => ({
    synchronizePearl: (...args: unknown[]) => mockSynchronizePearl(...args),
}));

vi.mock('utils/synchronize/check', () => ({
    analyseResult: (...args: unknown[]) => mockAnalyseResult(...args),
    getNotifFromResult: (result: { state: NotificationState; messages: string[] }) => result,
    saveSyncPearlData: (...args: unknown[]) => mockSaveSyncPearlData(...args),
    storeSurveyUnitsIds: (...args: unknown[]) => mockStoreSurveyUnitsIds(...args),
}));

vi.mock('../Preloader', () => ({
    Preloader: ({ children }: PropsWithChildren<unknown>) => <div>{children}</div>,
}));

function TriggerSync() {
    const context = useContext(SyncContext);

    useEffect(() => {
        context?.syncFunction(undefined);
    }, [context]);

    return null;
}

describe('SyncContextProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        globalThis.localStorage.clear();

        mockHealthCheck.mockResolvedValue({ status: 200 });
        mockStoreSurveyUnitsIds.mockResolvedValue(undefined);
    });

    it('stores survey unit ids in local storage before starting Queen synchronization', async () => {
        let resolveStore!: () => void;
        const storePromise = new Promise<void>((resolve) => {
            resolveStore = resolve;
        });

        mockStoreSurveyUnitsIds.mockReturnValue(storePromise);
        mockSynchronizePearl.mockResolvedValue({ error: false });

        render(
            <SyncContextProvider>
                <TriggerSync />
            </SyncContextProvider>
        );

        await waitFor(() => expect(mockSynchronizePearl).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(mockStoreSurveyUnitsIds).toHaveBeenCalledTimes(1));

        // While storeSurveyUnitsIds is still pending,
        // Queen sync must not have started yet
        expect(mockSynchronizeQueen).not.toHaveBeenCalled();

        // Now resolve the awaited storage step
        resolveStore();

        // Queen sync must start
        await waitFor(() => expect(mockSynchronizeQueen).toHaveBeenCalledTimes(1));
    });

    it('starts Queen synchronization even when storing survey unit ids fails', async () => {
        const consoleWarnSpy = vi.spyOn(console, 'warn')

        mockSynchronizePearl.mockResolvedValue({ error: false });
        mockStoreSurveyUnitsIds.mockRejectedValue(new Error('local storage failure'));

        render(
            <SyncContextProvider>
                <TriggerSync />
            </SyncContextProvider>
        );

        await waitFor(() => expect(mockSynchronizePearl).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(mockStoreSurveyUnitsIds).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(mockSynchronizeQueen).toHaveBeenCalledTimes(1));

        expect(mockSaveSyncPearlData).toHaveBeenCalledWith({ error: false });
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            'Unable to store survey units ids in local storage',
            expect.any(Error)
        );
    });

    it('does not store survey unit ids or start Queen synchronization when Pearl synchronization fails', async () => {
        mockSynchronizePearl.mockResolvedValue({ error: true });

        render(
            <SyncContextProvider>
                <TriggerSync />
            </SyncContextProvider>
        );

        await waitFor(() => expect(mockSynchronizePearl).toHaveBeenCalledTimes(1));

        expect(mockSaveSyncPearlData).toHaveBeenCalledWith({ error: true });
        expect(mockStoreSurveyUnitsIds).not.toHaveBeenCalled();
        expect(mockSynchronizeQueen).not.toHaveBeenCalled();
    });
});
