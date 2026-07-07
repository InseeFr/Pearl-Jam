import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useQueenSynchronization } from './useQueenSynchronization';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe('useQueenSynchronization', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    it('should set queen as ready without error when QUEEN responds READY', () => {
        const { result } = renderHook(() => useQueenSynchronization());

        act(() => {
            result.current.checkQueen();
        });

        expect(result.current.queenReady).toBe(null);
        expect(result.current.queenError).toBe(false);

        act(() => {
            const event = new CustomEvent('QUEEN', {
                detail: {
                    type: 'QUEEN',
                    command: 'HEALTH_CHECK',
                    state: 'READY',
                },
            });
            globalThis.dispatchEvent(event);
        });

        expect(result.current.queenReady).toBe(true);
        expect(result.current.queenError).toBe(false);
    });

    it('should set queen as ready with error when QUEEN responds with a non-ready state', () => {
        const { result } = renderHook(() => useQueenSynchronization());

        act(() => {
            result.current.checkQueen();
        });

        expect(result.current.queenReady).toBe(null);
        expect(result.current.queenError).toBe(false);

        act(() => {
            const event = new CustomEvent('QUEEN', {
                detail: {
                    type: 'QUEEN',
                    command: 'HEALTH_CHECK',
                    state: 'NOT_READY',
                },
            });
            globalThis.dispatchEvent(event);
        });

        expect(result.current.queenReady).toBe(true);
        expect(result.current.queenError).toBe(true);
    });

    it('should set Queen as ready with error if QUEEN does not respond before timeout', () => {
        const { result } = renderHook(() => useQueenSynchronization());

        act(() => {
            result.current.checkQueen();
        });

        expect(result.current.queenReady).toBe(null);
        expect(result.current.queenError).toBe(false);

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(result.current.queenReady).toBe(true);
        expect(result.current.queenError).toBe(true);
    });

    it('should ignore other QUEEN events than healthcheck', () => {
        const { result } = renderHook(() => useQueenSynchronization());

        act(() => {
            result.current.checkQueen();
        });

        act(() => {
            const event = new CustomEvent('QUEEN', {
                detail: {
                    type: 'QUEEN',
                    command: 'OTHER',
                    interrogationId: 'id-1',
                    state: 'STARTED',
                },
            });
            globalThis.dispatchEvent(event);
        });

        expect(result.current.queenReady).toBe(null);
        expect(result.current.queenError).toBe(false);

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(result.current.queenReady).toBe(true);
        expect(result.current.queenError).toBe(true);
    });

    it('should navigate to queen synchronize page', () => {
        const { result } = renderHook(() => useQueenSynchronization());

        act(() => {
            result.current.synchronizeQueen();
        });

        expect(mockNavigate).toHaveBeenCalledWith('/queen/synchronize');
    });
});
