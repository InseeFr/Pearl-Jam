import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach } from 'node:test';
import { ComponentPropsWithoutRef } from 'react';
import { describe, expect, it, Mock, vi } from 'vitest';
import D from '../../i18n/build-dictionary';
import { useNetworkOnline } from '../../utils/hooks/useOnline';
import { SyncContext, SyncContextValue } from '../Sync/SyncContextProvider';
import { SynchronizeButton } from './SynchronizeButton';

vi.mock('../../utils/hooks/useOnline', () => ({
  useNetworkOnline: vi.fn(),
}));

vi.mock('@mui/material/Button', () => {
  return {
    default: ({ children, disabled, onClick }: ComponentPropsWithoutRef<'button'>) => (
      <button disabled={disabled} onClick={onClick}>
        {children}
      </button>
    ),
  };
});

describe('SynchronizeButton', () => {
  const mockSyncFunction = vi.fn();

  beforeEach(() => {
    mockSyncFunction.mockClear();
  });

  it('renders the button with correct text', () => {
    (useNetworkOnline as Mock).mockReturnValue(true);
    render(
      <SyncContext.Provider
        value={{ syncFunction: mockSyncFunction } as unknown as SyncContextValue}
      >
        <SynchronizeButton />
      </SyncContext.Provider>
    );

    screen.getByRole('button', { name: D.synchronizeButton });
  });

  it('disables the button when offline', () => {
    (useNetworkOnline as Mock).mockReturnValue(false);
    render(
      <SyncContext.Provider
        value={{ syncFunction: mockSyncFunction } as unknown as SyncContextValue}
      >
        <SynchronizeButton />
      </SyncContext.Provider>
    );

    expect(
      screen.getByRole('button', { name: D.synchronizeButton }).getAttribute('disabled')
    ).toBeDefined();
  });

  it('calls syncFunction when clicked', () => {
    (useNetworkOnline as Mock).mockReturnValue(true);
    render(
      <SyncContext.Provider
        value={{ syncFunction: mockSyncFunction } as unknown as SyncContextValue}
      >
        <SynchronizeButton />
      </SyncContext.Provider>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(mockSyncFunction).toHaveBeenCalledTimes(1);
  });
});
