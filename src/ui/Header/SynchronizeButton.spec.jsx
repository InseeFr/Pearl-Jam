import { render, screen, fireEvent } from '@testing-library/react';
import { SynchronizeButton } from './SynchronizeButton';
import { SyncContext } from '../Sync/SyncContextProvider';
import { useNetworkOnline } from '../../utils/hooks/useOnline';
import D from '../../i18n/build-dictionary';

vi.mock('../../utils/hooks/useOnline', () => ({
  useNetworkOnline: vi.fn(),
}));

vi.mock('@mui/material/Button', () => {
  return {
    default: ({ children, disabled, onClick }) => (
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
    useNetworkOnline.mockReturnValue(true);
    render(
      <SyncContext.Provider value={{ syncFunction: mockSyncFunction }}>
        <SynchronizeButton />
      </SyncContext.Provider>
    );

    screen.getByRole('button', { name: D.synchronizeButton });
  });

  it('disables the button when offline', () => {
    useNetworkOnline.mockReturnValue(false);
    render(
      <SyncContext.Provider value={{ syncFunction: mockSyncFunction }}>
        <SynchronizeButton />
      </SyncContext.Provider>
    );

    screen.getByRole('button', { name: D.synchronizeButton, disabled: true });
  });

  it('calls syncFunction when clicked', () => {
    useNetworkOnline.mockReturnValue(true);
    render(
      <SyncContext.Provider value={{ syncFunction: mockSyncFunction }}>
        <SynchronizeButton />
      </SyncContext.Provider>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(mockSyncFunction).toHaveBeenCalledTimes(1);
  });
});
