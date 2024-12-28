import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import * as useOnlineHook from '../../utils/hooks/useOnline';
import { NetworkStatus } from './NetworkStatus';

describe('NetworkStatus Component', () => {
  it('should display the WifiIcon when online', () => {
    vi.spyOn(useOnlineHook, 'useNetworkOnline').mockReturnValue(true);

    render(<NetworkStatus />);

    screen.getByTestId('WifiIcon');
  });

  it('should display the WifiOffIcon when offline', () => {
    vi.spyOn(useOnlineHook, 'useNetworkOnline').mockReturnValue(false);

    render(<NetworkStatus />);

    screen.getByTestId('WifiOffIcon');
  });
});
