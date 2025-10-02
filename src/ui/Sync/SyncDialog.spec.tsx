import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import D from 'i18n';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { SyncResult, SyncResultDetails } from 'types/pearl';
import { theme } from '../PearlTheme';
import { SyncDialog } from './SyncDialog';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('SyncDialog Component', () => {
  const mockOnClose = vi.fn();
  const mockOnNotificationClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Dialog rendering', () => {
    it('should render dialog with title', () => {
      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Sync completed'],
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText(D.syncResult);
    });

    it('should render success state with title', () => {
      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Sync completed successfully'],
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText(D.titleSync('success'));
    });

    it('should render warning state with title', () => {
      const syncResult: SyncResult = {
        state: 'warning',
        messages: ['Sync completed with warnings'],
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText(D.titleSync('warning'));
    });

    it('should render error state with title', () => {
      const syncResult: SyncResult = {
        state: 'error',
        messages: ['Sync failed'],
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText(D.titleSync('error'));
    });

    it('should render all messages', () => {
      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Message 1', 'Message 2', 'Message 3'],
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText('Message 1');
      screen.getByText('Message 2');
      screen.getByText('Message 3');
    });

    it('should render warning messages correctly', () => {
      const syncResult: SyncResult = {
        state: 'warning',
        messages: ['Warning message 1', 'Warning message 2'],
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText('Warning message 1');
      screen.getByText('Warning message 2');
    });

    it('should render success messages correctly', () => {
      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Success message'],
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText('Success message');
    });
  });

  describe('Dialog actions', () => {
    it('should show notification button when state is success', () => {
      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Sync completed'],
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText(D.notifications);
    });

    it('should not show notification button when state is not success', () => {
      const syncResult: SyncResult = {
        state: 'error',
        messages: ['Sync failed'],
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      expect(screen.queryByText(D.notifications)).toBeNull();
    });

    it('should always show close button', () => {
      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Sync completed'],
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText(D.iUnderstand);
    });

    it('should call onClose when close button is clicked', () => {
      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Sync completed'],
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      const closeButton = screen.getByText(D.iUnderstand);
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onNotificationClick when notification button is clicked', () => {
      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Sync completed'],
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      const notificationButton = screen.getByText(D.notifications);
      fireEvent.click(notificationButton);

      expect(mockOnNotificationClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('SyncDetail rendering', () => {
    it('should render details section when state is success', () => {
      const details: SyncResultDetails = {
        transmittedSurveyUnits: { CAMPAIGN1: ['SU001'] },
        loadedSurveyUnits: { CAMPAIGN1: ['SU002'] },
        startedWeb: {},
        terminatedWeb: {},
      };

      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Sync completed'],
        details,
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText(D.detailsSync);
    });

    it('should not render details section when state is error', () => {
      const details: SyncResultDetails = {
        transmittedSurveyUnits: { CAMPAIGN1: ['SU001'] },
        loadedSurveyUnits: { CAMPAIGN1: ['SU002'] },
        startedWeb: {},
        terminatedWeb: {},
      };

      const syncResult: SyncResult = {
        state: 'error',
        messages: ['Sync failed'],
        details,
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      expect(screen.queryByText(D.detailsSync)).toBeNull();
    });

    it('should display campaign names in lowercase', () => {
      const details: SyncResultDetails = {
        transmittedSurveyUnits: { CAMPAIGN1: ['SU001'] },
        loadedSurveyUnits: {},
        startedWeb: {},
        terminatedWeb: {},
      };

      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Sync completed'],
        details,
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText(/campaign1/i);
    });

    it('should display loaded survey units count', () => {
      const details: SyncResultDetails = {
        transmittedSurveyUnits: {},
        loadedSurveyUnits: { CAMPAIGN1: ['SU001', 'SU002', 'SU003'] },
        startedWeb: {},
        terminatedWeb: {},
      };

      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Sync completed'],
        details,
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText(new RegExp(D.loadedSurveyUnits(3)));
    });

    it('should display transmitted survey units count', () => {
      const details: SyncResultDetails = {
        transmittedSurveyUnits: { CAMPAIGN1: ['SU001', 'SU002'] },
        loadedSurveyUnits: {},
        startedWeb: {},
        terminatedWeb: {},
      };

      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Sync completed'],
        details,
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText(new RegExp(D.transmittedSurveyUnits(2)));
    });

    it('should display started web survey units count', () => {
      const details: SyncResultDetails = {
        transmittedSurveyUnits: {},
        loadedSurveyUnits: { CAMPAIGN1: ['SU001'] },
        startedWeb: { CAMPAIGN1: ['SU002', 'SU003'] },
        terminatedWeb: {},
      };

      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Sync completed'],
        details,
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText(new RegExp(D.webInitSurveyUnit(2)));
    });

    it('should display terminated web survey units count', () => {
      const details: SyncResultDetails = {
        transmittedSurveyUnits: {},
        loadedSurveyUnits: { CAMPAIGN1: ['SU001'] },
        startedWeb: {},
        terminatedWeb: { CAMPAIGN1: ['SU002', 'SU003', 'SU004'] },
      };

      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Sync completed'],
        details,
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText(new RegExp(D.webTerminatedSurveyUnit(3)));
    });

    it('should display multiple campaigns', () => {
      const details: SyncResultDetails = {
        transmittedSurveyUnits: { CAMPAIGN1: ['SU001'], CAMPAIGN2: ['SU002'] },
        loadedSurveyUnits: {},
        startedWeb: {},
        terminatedWeb: {},
      };

      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Sync completed'],
        details,
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText(/campaign1/i);
      screen.getByText(/campaign2/i);
    });

    it('should show "nothing to display" when no campaigns have data', () => {
      const details: SyncResultDetails = {
        transmittedSurveyUnits: {},
        loadedSurveyUnits: {},
        startedWeb: {},
        terminatedWeb: {},
      };

      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Sync completed'],
        details,
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText(D.nothingToDisplay);
    });

    it('should filter out campaigns with no data', () => {
      const details: SyncResultDetails = {
        transmittedSurveyUnits: { CAMPAIGN1: ['SU001'], CAMPAIGN2: [] },
        loadedSurveyUnits: { CAMPAIGN3: [] },
        startedWeb: {},
        terminatedWeb: {},
      };

      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Sync completed'],
        details,
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText(/campaign1/i);
      expect(screen.queryByText(/campaign2/i)).toBeNull();
      expect(screen.queryByText(/campaign3/i)).toBeNull();
    });

    it('should handle undefined details', () => {
      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Sync completed'],
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText(D.nothingToDisplay);
    });

    it('should display all types of survey units for a campaign', () => {
      const details: SyncResultDetails = {
        transmittedSurveyUnits: { CAMPAIGN1: ['SU001'] },
        loadedSurveyUnits: { CAMPAIGN1: ['SU002', 'SU003'] },
        startedWeb: { CAMPAIGN1: ['SU004'] },
        terminatedWeb: { CAMPAIGN1: ['SU005', 'SU006'] },
      };

      const syncResult: SyncResult = {
        state: 'success',
        messages: ['Sync completed'],
        details,
      };

      renderWithTheme(
        <SyncDialog
          onClose={mockOnClose}
          onNotificationClick={mockOnNotificationClick}
          syncResult={syncResult}
        />
      );

      screen.getByText(new RegExp(D.transmittedSurveyUnits(1)));
      screen.getByText(new RegExp(D.loadedSurveyUnits(2)));
      screen.getByText(new RegExp(D.webInitSurveyUnit(1)));
      screen.getByText(new RegExp(D.webTerminatedSurveyUnit(2)));
    });
  });
});
