import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import D from '../../i18n/build-dictionary';
import { SurveyUnit } from 'types/pearl';
import { ArticulationTable, Questionnaires } from './Questionnaires';
import { PearlTheme } from '../PearlTheme';
import * as surveyUnitFunctions from '../../utils/functions/surveyUnitFunctions';
import * as synchronize from '../../utils/synchronize';
import React from 'react';

// Mock des modules
vi.mock('../../utils/functions/surveyUnitFunctions', () => ({
  isQuestionnaireAvailable: vi.fn(),
}));

vi.mock('../../utils/synchronize', () => ({
  getMostRecentState: vi.fn(),
}));

vi.mock('../../i18n/build-dictionary', async () => {
  const actual = await vi.importActual('../../i18n/build-dictionary');
  return {
    ...actual,
    getLang: vi.fn(() => 'fr'),
  };
});

// Mock du module distant dramaQueen
vi.mock('dramaQueen/useArticulationTable', () => ({
  default: {
    useArticulationTable: vi.fn(),
  },
}));

describe('Questionnaires Component', () => {
  const mockSurveyUnit: SurveyUnit = {
    id: 'survey-123',
    displayName: 'Survey Unit 123',
    persons: [],
    address: {} as any,
    priority: false,
    move: false,
    campaign: 'campaign-1',
    comments: [],
    sampleIdentifiers: {} as any,
    states: [
      { id: 1, date: 1700000000000, type: 'VIC' },
      { id: 2, date: 1700100000000, type: 'AOC' },
    ],
    contactAttempts: [],
    campaignLabel: 'Campaign Label',
    managementStartDate: 0,
    interviewerStartDate: 0,
    identificationPhaseStartDate: 0,
    collectionStartDate: Date.now() - 86400000, // 1 day ago
    collectionEndDate: Date.now() + 86400000, // 1 day from now
    endDate: Date.now() + 86400000,
    identificationConfiguration: 'IASCO' as any,
    contactOutcomeConfiguration: {} as any,
    contactAttemptConfiguration: {} as any,
    useLetterCommunication: false,
    communicationRequests: [],
    communicationTemplates: [],
    collectNextContacts: false,
    otherModeQuestionnaireState: [],
  };

  const renderWithProviders = (surveyUnit: SurveyUnit) => {
    return render(
      <PearlTheme>
        <BrowserRouter>
          <Questionnaires surveyUnit={surveyUnit} />
        </BrowserRouter>
      </PearlTheme>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(surveyUnitFunctions, 'isQuestionnaireAvailable').mockReturnValue(() => true);
    vi.spyOn(synchronize, 'getMostRecentState').mockReturnValue(undefined);
  });

  describe('Rendering', () => {
    it('should render the questionnaire section', () => {
      renderWithProviders(mockSurveyUnit);

      expect(screen.getByText(D.openQuestionnaire)).toBeDefined();
    });

    it('should render the access questionnaire button', () => {
      renderWithProviders(mockSurveyUnit);

      const button = screen.getByText(D.accessTheQuestionnaire);
      expect(button).toBeDefined();
      expect(button.closest('button')).toBeDefined();
    });

    it('should render the StickyNote2Icon', () => {
      renderWithProviders(mockSurveyUnit);

      const icon = screen.getByTestId('StickyNote2Icon');
      expect(icon).toBeDefined();
    });
  });

  describe('Questionnaire availability', () => {
    it('should enable the button when questionnaire is available', () => {
      vi.spyOn(surveyUnitFunctions, 'isQuestionnaireAvailable').mockReturnValue(() => true);

      renderWithProviders(mockSurveyUnit);

      const button = screen.getByText(D.accessTheQuestionnaire).closest('button');
      expect(button?.disabled).toBe(false);
    });

    it('should disable the button when questionnaire is not available', () => {
      vi.spyOn(surveyUnitFunctions, 'isQuestionnaireAvailable').mockReturnValue(() => false);

      renderWithProviders(mockSurveyUnit);

      const button = screen.getByText(D.accessTheQuestionnaire).closest('button');
      expect(button?.disabled).toBe(true);
    });
  });

  describe('StateChip display', () => {
    it('should display "in progress" chip when questionnaire is initialized', () => {
      const surveyUnit = {
        ...mockSurveyUnit,
        otherModeQuestionnaireState: [
          {
            id: '1',
            state: 'QUESTIONNAIRE_INIT' as const,
            date: '2023-01-01',
          },
        ],
      };

      renderWithProviders(surveyUnit);

      expect(screen.getByText(D.inProgress)).toBeDefined();
    });

    it('should display "finished" chip when questionnaire is completed', () => {
      const surveyUnit = {
        ...mockSurveyUnit,
        otherModeQuestionnaireState: [
          {
            id: '1',
            state: 'QUESTIONNAIRE_COMPLETED' as const,
            date: '2023-01-01',
          },
        ],
      };

      renderWithProviders(surveyUnit);

      expect(screen.getByText(D.finished)).toBeDefined();
    });

    it('should display "finished" chip when questionnaire is validated', () => {
      const surveyUnit = {
        ...mockSurveyUnit,
        otherModeQuestionnaireState: [
          {
            id: '1',
            state: 'QUESTIONNAIRE_VALIDATED' as const,
            date: '2023-01-01',
          },
        ],
      };

      renderWithProviders(surveyUnit);

      expect(screen.getByText(D.finished)).toBeDefined();
    });

    it('should display "not started" chip when questionnaire has not been initialized', () => {
      renderWithProviders(mockSurveyUnit);

      expect(screen.getByText(D.notStarted)).toBeDefined();
    });

    it('should not display any chip when questionnaire is not available', () => {
      vi.spyOn(surveyUnitFunctions, 'isQuestionnaireAvailable').mockReturnValue(() => false);

      renderWithProviders(mockSurveyUnit);

      expect(screen.queryByText(D.notStarted)).toBeNull();
      expect(screen.queryByText(D.inProgress)).toBeNull();
      expect(screen.queryByText(D.finished)).toBeNull();
    });
  });

  describe('Latest state date display', () => {
    it('should display the date when latestState has a date', () => {
      vi.spyOn(synchronize, 'getMostRecentState').mockReturnValue({
        id: '1',
        state: 'QUESTIONNAIRE_INIT',
        date: '2023-06-15',
      });

      renderWithProviders(mockSurveyUnit);

      expect(screen.getByText('15/06/2023')).toBeDefined();
    });

    it('should display CalendarMonthIcon when date is present', () => {
      vi.spyOn(synchronize, 'getMostRecentState').mockReturnValue({
        id: '1',
        state: 'QUESTIONNAIRE_INIT',
        date: '2023-06-15',
      });

      renderWithProviders(mockSurveyUnit);

      const icon = screen.getByTestId('CalendarMonthIcon');
      expect(icon).toBeDefined();
    });

    it('should not display the date section when latestState has no date', () => {
      vi.spyOn(synchronize, 'getMostRecentState').mockReturnValue(undefined);

      renderWithProviders(mockSurveyUnit);

      expect(screen.queryByTestId('CalendarMonthIcon')).toBeNull();
    });
  });

  describe('Articulation section', () => {
    const originalEnv = import.meta.env.VITE_ARTICULATION;

    beforeEach(() => {
      // Reset import meta env
      import.meta.env.VITE_ARTICULATION = '';
    });

    afterEach(() => {
      import.meta.env.VITE_ARTICULATION = originalEnv;
    });

    it('should not render articulation section when VITE_ARTICULATION is not set', () => {
      import.meta.env.VITE_ARTICULATION = '';

      renderWithProviders(mockSurveyUnit);

      expect(screen.queryByText(D.personDetails)).toBeNull();
    });

    it('should render articulation section title when VITE_ARTICULATION is set', () => {
      import.meta.env.VITE_ARTICULATION = 'true';

      renderWithProviders(mockSurveyUnit);

      expect(screen.getByText(D.personDetails)).toBeDefined();
      expect(screen.getByTestId('GroupOutlinedIcon')).toBeDefined();
    });
  });

  describe('Confirmation modal', () => {
    it('should show confirmation modal when clicking access questionnaire button', async () => {
      renderWithProviders(mockSurveyUnit);

      const button = screen.getByText(D.accessTheQuestionnaire);
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(D.questionnaireAccessConfirmationTitle)).toBeDefined();
        expect(screen.getByText(D.questionnaireAccessConfirmationMessage)).toBeDefined();
      });
    });

    it('should close modal when clicking cancel button', async () => {
      renderWithProviders(mockSurveyUnit);

      const button = screen.getByText(D.accessTheQuestionnaire);
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(D.questionnaireAccessConfirmationTitle)).toBeDefined();
      });

      const cancelButton = screen.getByText(D.cancelButton);
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText(D.questionnaireAccessConfirmationTitle)).toBeNull();
      });
    });
  });
});

describe('ArticulationTable Component', () => {
  const renderWithProviders = (table: any) => {
    return render(
      <PearlTheme>
        <BrowserRouter>
          <ArticulationTable table={table} />
        </BrowserRouter>
      </PearlTheme>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null when table is null', () => {
    const { container } = renderWithProviders(null);

    expect(container.firstChild).toBeNull();
  });

  it('should render table when table has data', () => {
    const mockTable = {
      rows: [
        {
          cells: [{ value: 1 }, { value: 2 }],
          progress: 1,
          label: 'Access',
          url: '/queen/survey-unit/123',
        },
      ],
    };

    renderWithProviders(mockTable);

    expect(screen.getByRole('table')).toBeDefined();
  });

  it('should render table rows with correct data', () => {
    const mockTable = {
      rows: [
        {
          cells: [{ value: 42 }, { value: 84 }],
          progress: 1,
          label: 'View details',
          url: '/queen/survey-unit/456',
        },
      ],
    };

    renderWithProviders(mockTable);

    expect(screen.getByText('42')).toBeDefined();
    expect(screen.getByText('84')).toBeDefined();
    expect(screen.getByText('View details')).toBeDefined();
  });

  it('should render PersonOutlineOutlinedIcon for each row', () => {
    const mockTable = {
      rows: [
        {
          cells: [{ value: 1 }],
          progress: 1,
          label: 'Access',
          url: '/queen/survey-unit/123',
        },
        {
          cells: [{ value: 2 }],
          progress: -1,
          label: 'Access',
          url: '/queen/survey-unit/124',
        },
      ],
    };

    renderWithProviders(mockTable);

    const icons = screen.getAllByTestId('PersonOutlineOutlinedIcon');
    expect(icons.length).toBe(2);
  });

  it('should render StateChip with correct progress values', () => {
    const mockTable = {
      rows: [
        {
          cells: [{ value: 1 }],
          progress: 1,
          label: 'Access',
          url: '/queen/survey-unit/123',
        },
      ],
    };

    renderWithProviders(mockTable);

    expect(screen.getByText(D.finished)).toBeDefined();
  });

  it('should render buttons correctly', () => {
    const mockTable = {
      rows: [
        {
          cells: [{ value: 1 }],
          progress: 1,
          label: 'Open questionnaire',
          url: '/queen/survey-unit/999',
        },
      ],
    };

    renderWithProviders(mockTable);

    const button = screen.getByText('Open questionnaire');
    expect(button.closest('button')).toBeDefined();
  });

  it('should render multiple rows correctly', () => {
    const mockTable = {
      rows: [
        {
          cells: [{ value: 10 }],
          progress: 1,
          label: 'Row 1',
          url: '/url1',
        },
        {
          cells: [{ value: 20 }],
          progress: -1,
          label: 'Row 2',
          url: '/url2',
        },
        {
          cells: [{ value: 30 }],
          progress: 2,
          label: 'Row 3',
          url: '/url3',
        },
      ],
    };

    renderWithProviders(mockTable);

    expect(screen.getByText('10')).toBeDefined();
    expect(screen.getByText('20')).toBeDefined();
    expect(screen.getByText('30')).toBeDefined();
    expect(screen.getByText('Row 1')).toBeDefined();
    expect(screen.getByText('Row 2')).toBeDefined();
    expect(screen.getByText('Row 3')).toBeDefined();
  });

  it('should show confirmation modal when clicking on row button', async () => {
    const mockTable = {
      rows: [
        {
          cells: [{ value: 1 }],
          progress: 1,
          label: 'Open questionnaire',
          url: '/queen/survey-unit/999',
        },
      ],
    };

    renderWithProviders(mockTable);

    const button = screen.getByText('Open questionnaire');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(D.questionnaireAccessConfirmationTitle)).toBeDefined();
      expect(screen.getByText(D.questionnaireAccessConfirmationMessage)).toBeDefined();
    });
  });

  it('should close modal when clicking cancel button in ArticulationTable', async () => {
    const mockTable = {
      rows: [
        {
          cells: [{ value: 1 }],
          progress: 1,
          label: 'Open questionnaire',
          url: '/queen/survey-unit/999',
        },
      ],
    };

    renderWithProviders(mockTable);

    const button = screen.getByText('Open questionnaire');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(D.questionnaireAccessConfirmationTitle)).toBeDefined();
    });

    const cancelButton = screen.getByText(D.cancelButton);
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText(D.questionnaireAccessConfirmationTitle)).toBeNull();
    });
  });
});
