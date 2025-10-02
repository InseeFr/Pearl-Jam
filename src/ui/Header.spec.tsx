import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import D from '../i18n/build-dictionary';
import * as useNotificationsHook from '../utils/hooks/useNotifications';
import { Header } from './Header';
import { SyncContext } from './Sync/SyncContextProvider';
import { PearlTheme } from './PearlTheme';

// Mock des modules
vi.mock('../utils/hooks/useNotifications', () => ({
  loadNotifications: vi.fn(),
  useUnreadNotificationsCount: vi.fn(),
}));

// Mock des sous-composants
vi.mock('./Header/NetworkStatus', () => ({
  NetworkStatus: () => <div data-testid="network-status">NetworkStatus</div>,
}));

vi.mock('./Header/Notifications', () => ({
  Notifications: ({ open, onClose }: { open: boolean; onClose: () => void }) => (
    <div data-testid="notifications" data-open={open}>
      Notifications
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

vi.mock('./Header/SynchronizeButton', () => ({
  SynchronizeButton: () => <div data-testid="synchronize-button">SynchronizeButton</div>,
}));

vi.mock('./Header/UserButton', () => ({
  UserButton: () => <div data-testid="user-button">UserButton</div>,
}));

describe('Header Component', () => {
  const mockSetNotificationOpened = vi.fn();
  const mockSyncFunction = vi.fn();
  const mockSetSyncResult = vi.fn();

  const mockSyncContextValue = {
    notificationOpened: false as const,
    setNotificationOpened: mockSetNotificationOpened,
    syncFunction: mockSyncFunction,
    setSyncResult: mockSetSyncResult,
  };

  const renderWithProviders = (notificationOpened: 'NORMAL' | 'LAST_NOTIF_OPENED' | false = false) => {
    const contextValue = {
      ...mockSyncContextValue,
      notificationOpened,
    };

    return render(
      <PearlTheme>
        <BrowserRouter>
          <SyncContext.Provider value={contextValue}>
            <Header />
          </SyncContext.Provider>
        </BrowserRouter>
      </PearlTheme>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useNotificationsHook, 'useUnreadNotificationsCount').mockReturnValue(0);
    vi.spyOn(useNotificationsHook, 'loadNotifications').mockResolvedValue(undefined);
  });

  describe('Rendering', () => {
    it('should render the header component', () => {
      renderWithProviders();
      const header = screen.getByRole('banner');
      expect(header).toBeDefined();
    });

    it('should render the Insee logo', () => {
      renderWithProviders();
      const logo = screen.getByAltText('Logo Insee');
      expect(logo).toBeDefined();
      expect(logo.getAttribute('src')).toBe('/static/images/Insee_logo_header.webp');
    });

    it('should render the Sabiane Collecte title', () => {
      renderWithProviders();
      expect(screen.getByText('Sabiane')).toBeDefined();
      expect(screen.getByText('Collecte')).toBeDefined();
    });

    it('should display the version number', () => {
      renderWithProviders();
      const versionElement = screen.getByText(/V\.\d+\.\d+\.\d+/);
      expect(versionElement).toBeDefined();
    });

    it('should render the tracking link', () => {
      renderWithProviders();
      const trackingLink = screen.getByText(D.goToMyTracking);
      expect(trackingLink).toBeDefined();
      expect(trackingLink.closest('a')?.getAttribute('href')).toBe('/suivi');
    });

    it('should render the notifications button', () => {
      renderWithProviders();
      const notificationsButton = screen.getByText(D.goToNotificationsPage);
      expect(notificationsButton).toBeDefined();
    });

    it('should render all header components', () => {
      renderWithProviders();
      expect(screen.getByTestId('network-status')).toBeDefined();
      expect(screen.getByTestId('synchronize-button')).toBeDefined();
      expect(screen.getByTestId('user-button')).toBeDefined();
    });
  });

  describe('Notifications', () => {
    it('should display notifications count badge when there are unread notifications', () => {
      vi.spyOn(useNotificationsHook, 'useUnreadNotificationsCount').mockReturnValue(5);
      renderWithProviders();

      // Le badge MUI affiche le nombre de notifications
      const badge = screen.getByText('5');
      expect(badge).toBeDefined();
    });

    it('should not display badge when there are no unread notifications', () => {
      vi.spyOn(useNotificationsHook, 'useUnreadNotificationsCount').mockReturnValue(0);
      renderWithProviders();

      // Le badge ne devrait pas être visible avec count = 0
      const badge = screen.queryByText('0');
      expect(badge).toBeNull();
    });

    it('should call loadNotifications on mount', () => {
      const loadNotificationsSpy = vi.spyOn(useNotificationsHook, 'loadNotifications');
      renderWithProviders();

      expect(loadNotificationsSpy).toHaveBeenCalledTimes(1);
    });

    it('should open notifications panel when clicking on notifications button', () => {
      renderWithProviders();

      const notificationsButton = screen.getByText(D.goToNotificationsPage);
      fireEvent.click(notificationsButton);

      expect(mockSetNotificationOpened).toHaveBeenCalledWith('NORMAL');
    });

    it('should display Notifications component when notificationOpened is truthy', () => {
      renderWithProviders('NORMAL');

      const notificationsPanel = screen.getByTestId('notifications');
      expect(notificationsPanel.getAttribute('data-open')).toBe('true');
    });

    it('should not display Notifications component when notificationOpened is false', () => {
      renderWithProviders(false);

      const notificationsPanel = screen.getByTestId('notifications');
      expect(notificationsPanel.getAttribute('data-open')).toBe('false');
    });

    it('should close notifications panel when onClose is called', () => {
      renderWithProviders('NORMAL');

      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);

      expect(mockSetNotificationOpened).toHaveBeenCalledWith(false);
    });
  });

  describe('Navigation', () => {
    it('should have a working link to home page', () => {
      renderWithProviders();

      const logoLink = screen.getByRole('heading').closest('a');
      expect(logoLink?.getAttribute('href')).toBe('/');
    });

    it('should have a working link to tracking page', () => {
      renderWithProviders();

      const trackingLink = screen.getByText(D.goToMyTracking).closest('a');
      expect(trackingLink?.getAttribute('href')).toBe('/suivi');
    });
  });

  describe('HeaderNavLink Component', () => {
    it('should render icon and text for navigation links', () => {
      renderWithProviders();

      // Vérifie que les icônes sont présentes via leur test id MUI
      const formatListIcon = screen.getByTestId('FormatListBulletedIcon');
      const notificationsIcon = screen.getByTestId('NotificationsNoneIcon');

      expect(formatListIcon).toBeDefined();
      expect(notificationsIcon).toBeDefined();
    });
  });
});
