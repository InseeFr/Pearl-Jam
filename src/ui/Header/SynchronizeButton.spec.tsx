import { render, screen, fireEvent } from '@testing-library/react';
import { SynchronizeButton } from './SynchronizeButton';
import { SyncContext } from '../Sync/SyncContextProvider';
import { useNetworkOnline } from '../../utils/hooks/useOnline';
import D from '../../i18n/build-dictionary';
import { describe, expect, it, Mock, MockContext, vi } from 'vitest';
import { beforeEach } from 'node:test';
import { ComponentPropsWithoutRef } from 'react';

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
      <SyncContext.Provider value={{ syncFunction: mockSyncFunction }}>
        <SynchronizeButton />
      </SyncContext.Provider>
    );

    screen.getByRole('button', { name: D.synchronizeButton });
  });

  it('disables the button when offline', () => {
    (useNetworkOnline as Mock).mockReturnValue(false);
    render(
      <SyncContext.Provider value={{ syncFunction: mockSyncFunction }}>
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
      <SyncContext.Provider value={{ syncFunction: mockSyncFunction }}>
        <SynchronizeButton />
      </SyncContext.Provider>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(mockSyncFunction).toHaveBeenCalledTimes(1);
  });
});
