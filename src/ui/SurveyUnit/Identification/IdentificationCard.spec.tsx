import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, expect, it, describe, beforeEach } from 'vitest';
import { IdentificationCard } from './IdentificationCard';
import { SurveyUnit } from 'types/pearl';
import { IdentificationConfiguration } from 'utils/enum/identifications/IdentificationsQuestions';
import * as utilsFunctions from 'utils/functions';
import D from 'i18n';

vi.mock('utils/functions', () => ({
  persistSurveyUnit: vi.fn(),
  addNewState: vi.fn(),
}));

const mockSurveyUnit: SurveyUnit = {
  identificationConfiguration: IdentificationConfiguration.IASCO,
  identification: {
    demenagementWeb: false,
    demenagementEnqueteur: false,
  },
  states: [{ type: 'VIC', date: Date.now() }],
  displayName: 'Test Survey',
  id: 'test-id',
  persons: [
    {
      id: 1,
      title: 'MISTER',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      birthdate: 0,
      favoriteEmail: false,
      privileged: false,
      phoneNumbers: [],
    },
  ],
  address: {
    l1: '',
    l2: '',
    l3: '',
    l4: '',
    l5: '',
    l6: '',
    l7: '',
    elevator: false,
    building: '',
    floor: '',
    door: '',
    staircase: '',
    cityPriorityDistrict: false,
  },
  priority: false,
  move: false,
  campaign: 'test-campaign',
  comments: [],
  sampleIdentifiers: {
    bs: 0,
    ec: '',
    le: 0,
    noi: 0,
    numfa: 0,
    rges: 0,
    ssech: 0,
    nolog: 0,
    nole: 0,
    autre: '',
    nograp: '',
  },
  contactAttempts: [],
  campaignLabel: 'Test Campaign',
  managementStartDate: 0,
  interviewerStartDate: 0,
  identificationPhaseStartDate: 0,
  collectionStartDate: 0,
  collectionEndDate: 0,
  endDate: 0,
  contactOutcomeConfiguration: 'TEL',
  contactAttemptConfiguration: 'TEL',
  useLetterCommunication: false,
  communicationRequests: [],
  communicationTemplates: [],
  otherModeQuestionnaireState: [{ id: '1', state: 'QUESTIONNAIRE_INIT', date: '2025-01-01' }],
};

describe('IdentificationCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('demenagementWeb checkbox', () => {
    it('should display the demenagementWeb checkbox when value is true', () => {
      const surveyUnit = {
        ...mockSurveyUnit,
        identification: {
          ...mockSurveyUnit.identification,
          demenagementWeb: true,
        },
      };

      render(<IdentificationCard surveyUnit={surveyUnit} />);

      const text = screen.getByText(D.moveDeclaredOnWeb);
      expect(text).toBeTruthy();
      const checkbox = screen.getByRole('checkbox', {
        name: new RegExp(D.moveDeclaredOnWeb, 'i'),
      });
      expect(checkbox.checked).toBe(true);
      expect(checkbox.disabled).toBe(true);
    });

    it('should not display the demenagementWeb checkbox when value is false', () => {
      render(<IdentificationCard surveyUnit={mockSurveyUnit} />);

      const text = screen.queryByText(D.moveDeclaredOnWeb);
      expect(text).toBeNull();
    });
  });

  describe('demenagementEnqueteur checkbox', () => {
    it('should display the demenagementEnqueteur checkbox when demenagementWeb is false', () => {
      render(<IdentificationCard surveyUnit={mockSurveyUnit} />);

      const text = screen.getByText(D.moveAllResidents);
      expect(text).toBeTruthy();
      const checkbox = screen.getByRole('checkbox', {
        name: new RegExp(D.moveAllResidents, 'i'),
      });
      expect(checkbox.checked).toBe(false);
      expect(checkbox.disabled).toBe(false);
    });

    it('should not display the demenagementEnqueteur checkbox when demenagementWeb is true', () => {
      const surveyUnit = {
        ...mockSurveyUnit,
        identification: {
          ...mockSurveyUnit.identification,
          demenagementWeb: true,
        },
      };

      render(<IdentificationCard surveyUnit={surveyUnit} />);

      const text = screen.queryByText(D.moveAllResidents);
      expect(text).toBeNull();
    });

    it('should call persistSurveyUnit with correct data when checkbox is checked', async () => {
      const persistSurveyUnitSpy = vi.spyOn(utilsFunctions, 'persistSurveyUnit');

      render(<IdentificationCard surveyUnit={mockSurveyUnit} />);

      const checkbox = screen.getByRole('checkbox', {
        name: new RegExp(D.moveAllResidents, 'i'),
      });

      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(persistSurveyUnitSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            identification: expect.objectContaining({
              demenagementEnqueteur: true,
            }),
            persons: [
              {
                title: 'MISTER',
                firstName: D.surveyUnitFirstName,
                lastName: D.surveyUnitLastName,
                email: '',
                birthdate: 0,
                favoriteEmail: false,
                privileged: true,
                phoneNumbers: [],
              },
            ],
            states: mockSurveyUnit.states,
            priority: true,
            otherModeQuestionnaireState: [],
          })
        );
      });
    });

    it('should restore original data when checkbox is unchecked', async () => {
      const surveyUnit = {
        ...mockSurveyUnit,
        identification: {
          ...mockSurveyUnit.identification,
          demenagementEnqueteur: true,
        },
      };

      const persistSurveyUnitSpy = vi.spyOn(utilsFunctions, 'persistSurveyUnit');

      render(<IdentificationCard surveyUnit={surveyUnit} />);

      const checkbox = screen.getByRole('checkbox', {
        name: new RegExp(D.moveAllResidents, 'i'),
      });

      expect(checkbox.checked).toBe(true);

      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(persistSurveyUnitSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            identification: expect.objectContaining({
              demenagementEnqueteur: false,
            }),
            persons: mockSurveyUnit.persons,
            states: mockSurveyUnit.states,
            otherModeQuestionnaireState: mockSurveyUnit.otherModeQuestionnaireState,
          })
        );
      });
    });
  });
});
