import { render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { NetworkStatus } from './NetworkStatus';
import { PearlTheme } from '../PearlTheme';

vi.mock('../../utils/hooks/useOnline', () => ({
  useNetworkOnline: vi.fn()
}));

import { useNetworkOnline } from '../../utils/hooks/useOnline';

describe('NetworkStatus', () => {
  beforeEach(() => {
    useNetworkOnline.mockClear();
  });

  it('displays the WifiOn icon when the connection is active', () => {
    useNetworkOnline.mockReturnValue(true);
    render(
      <PearlTheme>
        <NetworkStatus />
      </PearlTheme>
    );
    const wifiIcon = screen.getByTestId('WifiIcon');
    expect(wifiIcon).to.be.ok;
  });

  it('displays the WifiOff icon when the connection is inactive', () => {
    useNetworkOnline.mockReturnValue(false);
    render(
      <PearlTheme>
        <NetworkStatus />
      </PearlTheme>
    );
    const wifiOffIcon = screen.getByTestId('WifiOffIcon');
    expect(wifiOffIcon).to.be.ok;
  });
});
