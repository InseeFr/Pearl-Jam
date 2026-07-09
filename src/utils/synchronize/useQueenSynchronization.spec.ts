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
    });

    it('should navigate to queen synchronize page', () => {
        const { result } = renderHook(() => useQueenSynchronization());

        act(() => {
            result.current.synchronizeQueen();
        });

        expect(mockNavigate).toHaveBeenCalledWith('/queen/synchronize');
    });
});
