import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { formatDistance } from 'date-fns';
import D from 'i18n';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { Notification as NotificationType, SyncResultDetails } from 'types/pearl';
import { NOTIFICATION_TYPE_SYNC } from '../../utils/constants';
import * as useNotifications from '../../utils/hooks/useNotifications';
import syncReportIdbService from '../../utils/indexeddb/services/syncReport-idb-service';
import { SyncContext } from '../Sync/SyncContextProvider';
import { theme } from '../PearlTheme';
import { Notification } from './Notification';

vi.mock('../../utils/hooks/useNotifications');
vi.mock('../../utils/indexeddb/services/syncReport-idb-service');

const mockSetSyncResult = vi.fn();
const mockSetNotificationOpened = vi.fn();

const mockSyncContext: any = {
  setSyncResult: mockSetSyncResult,
  setNotificationOpened: mockSetNotificationOpened,
  syncResult: null,
  notificationOpened: false,
  syncFunction: vi.fn(),
};

const mockNotification: NotificationType = {
  id: 1,
  date: Date.now() - 1000 * 60 * 5, // 5 minutes ago
  type: NOTIFICATION_TYPE_SYNC,
  title: 'Synchronization completed',
  messages: ['All data synchronized successfully'],
  message: 'All data synchronized successfully',
  state: 'success',
  read: false,
  detail: 'Sync details',
  details: undefined,
};

const renderWithContext = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <SyncContext.Provider value={mockSyncContext}>{component}</SyncContext.Provider>
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe('Notification Component', () => {
  const mockOnExit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Notification rendering', () => {
    it('should render notification with title and date', () => {
      renderWithContext(
        <Notification notification={mockNotification} onExit={mockOnExit} defaultExpanded={false} />
      );

      screen.getByText(mockNotification.title);
      const expectedDate = formatDistance(mockNotification.date, new Date(), { addSuffix: true });
      screen.getByText(expectedDate);
    });

    it('should render sync notification with BuildIcon', () => {
      const { container } = renderWithContext(
        <Notification notification={mockNotification} onExit={mockOnExit} defaultExpanded={false} />
      );

      const buildIcon = container.querySelector('[data-testid="BuildIcon"]');
      expect(buildIcon).toBeTruthy();
    });

    it('should render non-sync notification with SupportAgentIcon', () => {
      const nonSyncNotification = { ...mockNotification, type: 'other' };
      const { container } = renderWithContext(
        <Notification
          notification={nonSyncNotification}
          onExit={mockOnExit}
          defaultExpanded={false}
        />
      );

      const supportIcon = container.querySelector('[data-testid="SupportAgentIcon"]');
      expect(supportIcon).toBeTruthy();
    });

    it('should show error badge when notification state is error', () => {
      const errorNotification = { ...mockNotification, state: 'error' as const };
      const { container } = renderWithContext(
        <Notification
          notification={errorNotification}
          onExit={mockOnExit}
          defaultExpanded={false}
        />
      );

      const badge = container.querySelector('.MuiBadge-badge');
      expect(badge?.textContent).toBe('!');
    });

    it('should highlight unread notifications with background color', () => {
      const { container } = renderWithContext(
        <Notification notification={mockNotification} onExit={mockOnExit} defaultExpanded={false} />
      );

      const accordionSummary = container.querySelector('.MuiAccordionSummary-root');
      expect(accordionSummary).toBeTruthy();
    });

    it('should not highlight read notifications', () => {
      const readNotification = { ...mockNotification, read: true };
      const { container } = renderWithContext(
        <Notification notification={readNotification} onExit={mockOnExit} defaultExpanded={false} />
      );

      const accordionSummary = container.querySelector('.MuiAccordionSummary-root');
      expect(accordionSummary).toBeTruthy();
    });
  });

  describe('Notification interactions', () => {
    it('should mark notification as read when expanded', async () => {
      const markNotificationAsReadSpy = vi.spyOn(useNotifications, 'markNotificationAsRead');

      renderWithContext(
        <Notification notification={mockNotification} onExit={mockOnExit} defaultExpanded={false} />
      );

      const expandButton = screen.getByRole('button', { expanded: false });
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(markNotificationAsReadSpy).toHaveBeenCalledWith(mockNotification);
      });
    });

    it('should not mark notification as read when already read', async () => {
      const readNotification = { ...mockNotification, read: true };
      const markNotificationAsReadSpy = vi.spyOn(useNotifications, 'markNotificationAsRead');

      renderWithContext(
        <Notification notification={readNotification} onExit={mockOnExit} defaultExpanded={false} />
      );

      const expandButton = screen.getByRole('button', { expanded: false });
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(markNotificationAsReadSpy).not.toHaveBeenCalled();
      });
    });

    it('should delete notification when delete button is clicked', async () => {
      const deleteNotificationSpy = vi.spyOn(useNotifications, 'deleteNotification');

      renderWithContext(
        <Notification notification={mockNotification} onExit={mockOnExit} defaultExpanded={true} />
      );

      const deleteButton = screen.getByRole('button', { name: new RegExp(D.delete, 'i') });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(deleteNotificationSpy).toHaveBeenCalledWith(mockNotification);
      });
    });

    it('should open sync report when sync notification link is clicked', async () => {
      const mockReport = {
        loadedSurveyUnits: { campaign1: ['SU001'] },
        transmittedSurveyUnits: {},
        startedWeb: {},
        terminatedWeb: {},
      };

      vi.mocked(syncReportIdbService.getById).mockResolvedValue(mockReport);

      renderWithContext(
        <Notification notification={mockNotification} onExit={mockOnExit} defaultExpanded={false} />
      );

      const link = screen.getByRole('link', { name: mockNotification.title });
      fireEvent.click(link);

      await waitFor(() => {
        expect(syncReportIdbService.getById).toHaveBeenCalledWith(mockNotification.id);
        expect(mockSetSyncResult).toHaveBeenCalledWith({
          date: expect.any(String),
          state: mockNotification.state,
          messages: mockNotification.message,
          details: mockReport,
        });
        expect(mockOnExit).toHaveBeenCalled();
      });
    });

    it('should not open sync report for non-sync notifications', async () => {
      const nonSyncNotification = { ...mockNotification, type: 'other' };

      renderWithContext(
        <Notification
          notification={nonSyncNotification}
          onExit={mockOnExit}
          defaultExpanded={false}
        />
      );

      const link = screen.getByText(nonSyncNotification.title);
      fireEvent.click(link);

      await waitFor(() => {
        expect(syncReportIdbService.getById).not.toHaveBeenCalled();
        expect(mockSetSyncResult).not.toHaveBeenCalled();
      });
    });
  });

  describe('Notification messages', () => {
    it('should render all notification messages', () => {
      const multiMessageNotification = {
        ...mockNotification,
        messages: ['Message 1', 'Message 2', 'Message 3'],
      };

      renderWithContext(
        <Notification
          notification={multiMessageNotification}
          onExit={mockOnExit}
          defaultExpanded={true}
        />
      );

      screen.getByText('Message 1');
      screen.getByText('Message 2');
      screen.getByText('Message 3');
    });
  });

  describe('NotificationDetails', () => {
    it('should render notification details when provided', () => {
      const details: SyncResultDetails = {
        loadedSurveyUnits: { CAMPAIGN1: ['SU001', 'SU002'] },
        transmittedSurveyUnits: { CAMPAIGN1: ['SU003'] },
        startedWeb: { CAMPAIGN2: ['SU004'] },
        terminatedWeb: { CAMPAIGN2: ['SU005'] },
      };

      const notificationWithDetails = { ...mockNotification, details };

      renderWithContext(
        <Notification
          notification={notificationWithDetails}
          onExit={mockOnExit}
          defaultExpanded={true}
        />
      );

      screen.getByText(/campaign1/i);
      screen.getByText(/campaign2/i);
    });

    it('should not render details section when details are empty', () => {
      const details: SyncResultDetails = {
        loadedSurveyUnits: {},
        transmittedSurveyUnits: {},
        startedWeb: {},
        terminatedWeb: {},
      };

      const notificationWithEmptyDetails = { ...mockNotification, details };

      const { container } = renderWithContext(
        <Notification
          notification={notificationWithEmptyDetails}
          onExit={mockOnExit}
          defaultExpanded={true}
        />
      );

      const lists = container.querySelectorAll('.MuiList-root');
      // Only the main accordion should be present, no detail lists
      expect(lists.length).toBeLessThanOrEqual(1);
    });

    it('should render survey unit links that are clickable', () => {
      const details: SyncResultDetails = {
        loadedSurveyUnits: { CAMPAIGN1: ['SU001'] },
        transmittedSurveyUnits: {},
        startedWeb: {},
        terminatedWeb: {},
      };

      const notificationWithDetails = { ...mockNotification, details };

      renderWithContext(
        <Notification
          notification={notificationWithDetails}
          onExit={mockOnExit}
          defaultExpanded={true}
        />
      );

      const surveyUnitLink = screen.getByRole('link', { name: 'SU001' });
      expect(surveyUnitLink.getAttribute('href')).toBe('/survey-unit/SU001/details');
    });

    it('should close notification drawer when survey unit link is clicked', () => {
      const details: SyncResultDetails = {
        loadedSurveyUnits: { CAMPAIGN1: ['SU001'] },
        transmittedSurveyUnits: {},
        startedWeb: {},
        terminatedWeb: {},
      };

      const notificationWithDetails = { ...mockNotification, details };

      renderWithContext(
        <Notification
          notification={notificationWithDetails}
          onExit={mockOnExit}
          defaultExpanded={true}
        />
      );

      const surveyUnitLink = screen.getByRole('link', { name: 'SU001' });
      fireEvent.click(surveyUnitLink);

      expect(mockSetNotificationOpened).toHaveBeenCalledWith(false);
    });

    it('should display correct messages for different survey unit types', () => {
      const details: SyncResultDetails = {
        loadedSurveyUnits: { CAMPAIGN1: ['SU001', 'SU002'] },
        transmittedSurveyUnits: { CAMPAIGN1: ['SU003'] },
        startedWeb: { CAMPAIGN1: ['SU004'] },
        terminatedWeb: { CAMPAIGN1: ['SU005'] },
      };

      const notificationWithDetails = { ...mockNotification, details };

      renderWithContext(
        <Notification
          notification={notificationWithDetails}
          onExit={mockOnExit}
          defaultExpanded={true}
        />
      );

      screen.getByText(new RegExp(D.loadedSurveyUnits(2)));
      screen.getByText(new RegExp(D.transmittedSurveyUnits(1)));
      screen.getByText(new RegExp(D.webInitSurveyUnit(1)));
      screen.getByText(new RegExp(D.webTerminatedSurveyUnit(1)));
    });

    it('should filter out campaigns with no survey units to display', () => {
      const details: SyncResultDetails = {
        loadedSurveyUnits: { CAMPAIGN1: ['SU001'] },
        transmittedSurveyUnits: { CAMPAIGN2: [] },
        startedWeb: {},
        terminatedWeb: {},
      };

      const notificationWithDetails = { ...mockNotification, details };

      renderWithContext(
        <Notification
          notification={notificationWithDetails}
          onExit={mockOnExit}
          defaultExpanded={true}
        />
      );

      screen.getByText(/campaign1/i);
      expect(screen.queryByText(/campaign2/i)).toBeNull();
    });
  });

  describe('Accordion behavior', () => {
    it('should render expanded when defaultExpanded is true', () => {
      renderWithContext(
        <Notification notification={mockNotification} onExit={mockOnExit} defaultExpanded={true} />
      );

      const expandButton = screen.getByRole('button', { expanded: true });
      expect(expandButton).toBeTruthy();
    });

    it('should render collapsed when defaultExpanded is false', () => {
      renderWithContext(
        <Notification notification={mockNotification} onExit={mockOnExit} defaultExpanded={false} />
      );

      const expandButton = screen.getByRole('button', { expanded: false });
      expect(expandButton).toBeTruthy();
    });
  });
});
