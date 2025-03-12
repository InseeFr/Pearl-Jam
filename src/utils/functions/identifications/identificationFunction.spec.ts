import { describe, it, expect } from 'vitest';
import {
  checkAvailability,
  isIdentificationFinished,
  IdentificationQuestions,
  isInvalidIdentificationAndContactOutcome,
  transmissionRules,
  TransmissionRules,
  validateTransmission,
} from './identificationFunctions';
import {
  IdentificationConfiguration,
  IdentificationQuestionOptionValues,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestions';
import { SurveyUnit } from 'types/pearl';
import { contactOutcomes } from '../contacts/ContactOutcome';
import { commonTransmissionRules } from './questionsTree/commonTransmissionRules';

const mockQuestions: IdentificationQuestions = {
  map: {
    [IdentificationQuestionsId.INDIVIDUAL_STATUS]: {
      id: IdentificationQuestionsId.INDIVIDUAL_STATUS,
      text: 'Person Question',
      options: [
        { value: 'YES', label: 'Yes', concluding: false },
        { value: 'NO', label: 'No', concluding: true },
      ],
    },
    [IdentificationQuestionsId.SITUATION]: {
      id: IdentificationQuestionsId.SITUATION,
      text: 'Situation Question',
      options: [
        { value: 'ACTIVE', label: 'Active', concluding: false },
        { value: 'INACTIVE', label: 'Inactive', concluding: true },
      ],
      dependsOn: {
        questionId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
        values: ['YES'],
      },
    },
  },
};

const mockedSurveyUnit: SurveyUnit = {
  displayName: '',
  id: '',
  persons: [],
  address: {} as any,
  priority: true,
  move: null,
  campaign: '',
  comments: [],
  sampleIdentifiers: {} as any,
  states: [{ type: 'WFT', date: Date.now() }],
  contactAttempts: [],
  campaignLabel: '',
  managementStartDate: 0,
  interviewerStartDate: 0,
  identificationPhaseStartDate: 0,
  collectionStartDate: 0,
  collectionEndDate: 0,
  endDate: 0,
  identificationConfiguration: IdentificationConfiguration.NOIDENT,
  contactOutcomeConfiguration: 'F2F',
  contactAttemptConfiguration: 'F2F',
  useLetterCommunication: false,
  communicationRequests: [],
  communicationTemplates: [],
};

const mockedSurveyUnits: { input: SurveyUnit; output: boolean }[] = [
  {
    input: {
      ...mockedSurveyUnit,
      identificationConfiguration: IdentificationConfiguration.NOIDENT,
      identification: {},
      contactAttempts: [{ status: 'APT', date: Date.now(), medium: 'PHONE' }],
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 1,
        type: contactOutcomes.REFUSAL.value,
      },
    },
    output: true,
  },
  {
    input: {
      ...mockedSurveyUnit,
      identificationConfiguration: IdentificationConfiguration.NOIDENT,
      identification: {},
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 1,
        type: contactOutcomes.REFUSAL.value,
      },
      contactAttempts: [],
    },
    output: false,
  },
  {
    input: {
      ...mockedSurveyUnit,
      identificationConfiguration: IdentificationConfiguration.NOIDENT,
      identification: {},
      contactAttempts: [],
    },
    output: false,
  },
  {
    input: {
      ...mockedSurveyUnit,
      identificationConfiguration: IdentificationConfiguration.IASCO,
      identification: {
        identification: IdentificationQuestionOptionValues.IDENTIFIED,
        access: IdentificationQuestionOptionValues.ACC,
        situation: IdentificationQuestionOptionValues.ABSORBED, // Concluding
      },
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 1,
        type: contactOutcomes.REFUSAL.value,
      },
      contactAttempts: [{ status: 'APT', date: Date.now(), medium: 'PHONE' }],
    },
    output: true,
  },
  {
    input: {
      ...mockedSurveyUnit,
      identificationConfiguration: IdentificationConfiguration.IASCO,
      identification: {
        identification: IdentificationQuestionOptionValues.IDENTIFIED,
        access: IdentificationQuestionOptionValues.ACC,
        situation: IdentificationQuestionOptionValues.ORDINARY, // Missing remaining identifications
      },
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 1,
        type: contactOutcomes.REFUSAL.value,
      },
      contactAttempts: [{ status: 'APT', date: Date.now(), medium: 'PHONE' }],
    },
    output: false,
  },
  {
    input: {
      ...mockedSurveyUnit,
      identificationConfiguration: IdentificationConfiguration.IASCO,
      identification: {
        identification: IdentificationQuestionOptionValues.IDENTIFIED,
        access: IdentificationQuestionOptionValues.ACC,
        situation: IdentificationQuestionOptionValues.ABSORBED, // Concluding
      },
      // INA + WFT -> VALID
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 1,
        type: contactOutcomes.INTERVIEW_ACCEPTED.value,
      },
      contactAttempts: [{ status: 'APT', date: Date.now(), medium: 'PHONE' }],
    },
    output: true,
  },
  {
    input: {
      ...mockedSurveyUnit,
      identificationConfiguration: IdentificationConfiguration.IASCO,
      identification: {
        identification: IdentificationQuestionOptionValues.IDENTIFIED,
        access: IdentificationQuestionOptionValues.ACC,
        situation: IdentificationQuestionOptionValues.ABSORBED, // Concluding
      },
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 1,
        type: contactOutcomes.INTERVIEW_ACCEPTED.value,
      },
      contactAttempts: [{ status: 'APT', date: Date.now(), medium: 'PHONE' }],
      states: [{ type: 'NOA', date: Date.now() }],
    },
    output: false,
  },
  {
    input: {
      ...mockedSurveyUnit,
      identificationConfiguration: IdentificationConfiguration.IASCO,
      identification: {
        identification: IdentificationQuestionOptionValues.IDENTIFIED,
        access: IdentificationQuestionOptionValues.ACC,
        situation: IdentificationQuestionOptionValues.ORDINARY,
        category: IdentificationQuestionOptionValues.PRIMARY,
        occupant: IdentificationQuestionOptionValues.IDENTIFIED,
      },
      // INA + NOA -> invalid
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 1,
        type: contactOutcomes.INTERVIEW_ACCEPTED.value,
      },
      contactAttempts: [{ status: 'APT', date: Date.now(), medium: 'PHONE' }],
      states: [{ type: 'NOA', date: Date.now() }],
    },
    output: false,
  },
  {
    input: {
      ...mockedSurveyUnit,
      identificationConfiguration: IdentificationConfiguration.INDTEL,
      identification: {
        individualStatus: IdentificationQuestionOptionValues.NOFIELD,
      },
      // WFT + INA + NOFIELD -> valid
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 1,
        type: contactOutcomes.INTERVIEW_ACCEPTED.value,
      },
      contactAttempts: [{ status: 'APT', date: Date.now(), medium: 'PHONE' }],
    },
    output: true,
  },
  {
    input: {
      ...mockedSurveyUnit,
      identificationConfiguration: IdentificationConfiguration.INDTELNOR,
      identification: {
        individualStatus: IdentificationQuestionOptionValues.SAME_ADDRESS,
        situation: IdentificationQuestionOptionValues.NOORDINARY,
      },
      //  NOA + NOORDINARY -> unvalid
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 1,
        type: contactOutcomes.NOT_APPLICABLE.value,
      },
      contactAttempts: [{ status: 'APT', date: Date.now(), medium: 'PHONE' }],
    },
    output: false,
  },
  {
    input: {
      ...mockedSurveyUnit,
      identificationConfiguration: IdentificationConfiguration.INDTELNOR,
      identification: {
        individualStatus: IdentificationQuestionOptionValues.SAME_ADDRESS,
        situation: IdentificationQuestionOptionValues.ORDINARY,
      },
      //  DUK + ORDINARY -> valid
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 1,
        type: contactOutcomes.DEFINITLY_UNAVAILABLE.value,
      },
      contactAttempts: [{ status: 'APT', date: Date.now(), medium: 'PHONE' }],
    },
    output: true,
  },
  {
    input: {
      ...mockedSurveyUnit,
      identificationConfiguration: IdentificationConfiguration.HOUSETELWSR,
      identification: {
        situation: IdentificationQuestionOptionValues.ORDINARY,
      },
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 1,
        type: contactOutcomes.DEFINITLY_UNAVAILABLE_FOR_UNKNOWN_REASON.value,
      },
      contactAttempts: [{ status: 'APT', date: Date.now(), medium: 'PHONE' }],
    },
    output: false,
  },
  {
    input: {
      ...mockedSurveyUnit,
      identificationConfiguration: IdentificationConfiguration.HOUSETELWSR,
      identification: {
        situation: IdentificationQuestionOptionValues.ORDINARY,
        category: IdentificationQuestionOptionValues.SECONDARY,
      },
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 1,
        type: contactOutcomes.NOT_APPLICABLE.value,
      },
      contactAttempts: [{ status: 'APT', date: Date.now(), medium: 'PHONE' }],
    },
    output: false,
  },
  {
    input: {
      ...mockedSurveyUnit,
      identificationConfiguration: IdentificationConfiguration.HOUSETELWSR,
      identification: {
        situation: IdentificationQuestionOptionValues.ORDINARY,
        category: IdentificationQuestionOptionValues.SECONDARY,
      },
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 1,
        type: contactOutcomes.INTERVIEW_ACCEPTED.value,
      },
      contactAttempts: [{ status: 'APT', date: Date.now(), medium: 'PHONE' }],
    },
    output: true,
  },
];

mockedSurveyUnits.forEach(({ input, output }) => {
  it(`ValidateTransmission should return ${output} when adding ${JSON.stringify(input)}`, () => {
    const result = validateTransmission(input);
    if (result !== output) {
      console.log('Failed input:', {
        identificationConfiguration: input.identificationConfiguration,
        identification: input.identification,
        contactOutcome: input.contactOutcome,
        contactAttempts: input.contactAttempts,
        states: input.states,
      });

      console.log('Expected: ', output);
      console.log('For given rules :', transmissionRules[input.identificationConfiguration]);
      if (
        transmissionRules[input.identificationConfiguration].invalidIdentificationsAndContactOutcome
      )
        console.log(
          'invalidIdentificationsAndContactOutcome :',
          transmissionRules[input.identificationConfiguration]
            .invalidIdentificationsAndContactOutcome
        );
    }

    expect(result).toBe(output);
  });
});

describe('checkAvailability', () => {
  it('should return true if there are no responses', () => {
    const result = checkAvailability(
      mockQuestions.map,
      mockQuestions.map[IdentificationQuestionsId.INDIVIDUAL_STATUS]
    );
    expect(result).toBe(true);
  });

  it('should return true if the question has no dependencies', () => {
    const result = checkAvailability(
      mockQuestions.map,
      mockQuestions.map[IdentificationQuestionsId.INDIVIDUAL_STATUS],
      {}
    );
    expect(result).toBe(true);
  });

  it('should return true if dependency values match', () => {
    const responses = {
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: {
        value: 'YES',
        label: 'Yes',
        concluding: false,
      },
    };
    const result = checkAvailability(
      mockQuestions.map,
      mockQuestions.map[IdentificationQuestionsId.SITUATION],
      responses
    );
    expect(result).toBe(true);
  });

  it('should return false if dependency values do not match', () => {
    const responses = {
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: {
        value: 'NO',
        label: 'No',
        concluding: true,
      },
    };
    const result = checkAvailability(
      mockQuestions.map,
      mockQuestions.map[IdentificationQuestionsId.SITUATION],
      responses
    );
    expect(result).toBe(false);
  });

  it('should return false if the dependency question is concluding', () => {
    const responses = {
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: {
        value: 'NO',
        label: 'No',
        concluding: true,
      },
    };
    const result = checkAvailability(
      mockQuestions.map,
      mockQuestions.map[IdentificationQuestionsId.SITUATION],
      responses
    );
    expect(result).toBe(false);
  });

  it('should return true if parent question is available and non-concluding', () => {
    const responses = {
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: {
        value: 'YES',
        label: 'Yes',
        concluding: false,
      },
    };
    const result = checkAvailability(
      mockQuestions.map,
      mockQuestions.map[IdentificationQuestionsId.SITUATION],
      responses
    );
    expect(result).toBe(true);
  });

  it('should handle cases with multiple levels of dependencies', () => {
    const extendedQuestions: IdentificationQuestions = {
      map: {
        ...mockQuestions.map,
        [IdentificationQuestionsId.CATEGORY]: {
          id: IdentificationQuestionsId.CATEGORY,
          text: 'Category Question',
          options: [
            { value: 'A', label: 'Category A', concluding: false },
            { value: 'B', label: 'Category B', concluding: true },
          ],
          dependsOn: {
            questionId: IdentificationQuestionsId.SITUATION,
            values: ['ACTIVE'],
          },
        },
      },
    };

    const responses = {
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: {
        value: 'YES',
        label: 'Yes',
        concluding: false,
      },
      [IdentificationQuestionsId.SITUATION]: {
        value: 'ACTIVE',
        label: 'Active',
        concluding: false,
      },
    };

    const result = checkAvailability(
      extendedQuestions.map,
      extendedQuestions.map[IdentificationQuestionsId.CATEGORY],
      responses
    );
    expect(result).toBe(true);
  });

  it('should return false if a parent question dependency chain fails', () => {
    const extendedQuestions: IdentificationQuestions = {
      map: {
        ...mockQuestions.map,
        [IdentificationQuestionsId.CATEGORY]: {
          id: IdentificationQuestionsId.CATEGORY,
          text: 'Category Question',
          options: [
            { value: 'A', label: 'Category A', concluding: false },
            { value: 'B', label: 'Category B', concluding: true },
          ],
          dependsOn: {
            questionId: IdentificationQuestionsId.SITUATION,
            values: ['ACTIVE'],
          },
        },
      },
    };

    const responses = {
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: {
        value: 'NO',
        label: 'No',
        concluding: true,
      },
      [IdentificationQuestionsId.SITUATION]: {
        value: 'INACTIVE',
        label: 'Inactive',
        concluding: true,
      },
    };

    const result = checkAvailability(
      extendedQuestions.map,
      extendedQuestions.map[IdentificationQuestionsId.CATEGORY],
      responses
    );
    expect(result).toBe(false);
  });
});

describe('identificationIsFinished', () => {
  it('should return false if identification is undefined', () => {
    const result = isIdentificationFinished(IdentificationConfiguration.INDTEL);
    expect(result).toBe(false);
  });

  it('should return false if any question is not answered', () => {
    const identification = {
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: 'answer1',
      // Missing answer for QUESTION_2
    };
    const result = isIdentificationFinished(IdentificationConfiguration.INDTEL, identification);
    expect(result).toBe(false);
  });

  it('should return true if all questions are answered', () => {
    const identification = {
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]:
        IdentificationQuestionOptionValues.SAME_ADDRESS,
      [IdentificationQuestionsId.SITUATION]: IdentificationQuestionOptionValues.ORDINARY,
    };
    const result = isIdentificationFinished(IdentificationConfiguration.INDTEL, identification);
    expect(result).toBe(true);
  });

  it('should return true if there are no questions in the configuration', () => {
    const result = isIdentificationFinished(IdentificationConfiguration.NOIDENT, {});
    expect(result).toBe(true);
  });

  it('should return true one question is concluding', () => {
    const identification = {
      [IdentificationQuestionsId.INDIVIDUAL_STATUS]: IdentificationQuestionOptionValues.NOIDENT,
    };
    const result = isIdentificationFinished(IdentificationConfiguration.INDTEL, identification);
    expect(result).toBe(true);
  });
});

describe('isInvalidIdentificationAndContactOutcome', () => {
  it('should return true if identification and contact outcome match the invalid rules', () => {
    const mockTransmissionRules: TransmissionRules = {
      ...commonTransmissionRules,
      invalidIdentificationsAndContactOutcome: {
        identifications: [
          {
            questionId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
            value: IdentificationQuestionOptionValues.NOIDENT,
          },
        ],
        contactOutcome: contactOutcomes.REFUSAL.value,
      },
    };

    const mockSurveyUnit = {
      identification: {
        [IdentificationQuestionsId.INDIVIDUAL_STATUS]: IdentificationQuestionOptionValues.NOIDENT,
      },
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 3,
        type: contactOutcomes.REFUSAL.value,
      },
      // other SurveyUnit properties can be mocked as needed
    } as SurveyUnit;

    const result = isInvalidIdentificationAndContactOutcome(mockTransmissionRules, mockSurveyUnit);
    expect(result).toBe(true);
  });

  it('should return false if identification does not match the invalid rules', () => {
    const mockTransmissionRules: TransmissionRules = {
      ...commonTransmissionRules,
      invalidIdentificationsAndContactOutcome: {
        identifications: [
          {
            questionId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
            value: IdentificationQuestionOptionValues.NOIDENT,
          },
        ],
        contactOutcome: contactOutcomes.REFUSAL.value,
      },
    };

    const mockSurveyUnit = {
      identification: {
        [IdentificationQuestionsId.INDIVIDUAL_STATUS]:
          IdentificationQuestionOptionValues.SAME_ADDRESS,
      },
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 2,
        type: contactOutcomes.REFUSAL.value,
      },
    } as SurveyUnit;

    const result = isInvalidIdentificationAndContactOutcome(mockTransmissionRules, mockSurveyUnit);
    expect(result).toBe(false);
  });

  it('should return false if contact outcome does not match the invalid rules', () => {
    const mockTransmissionRules: TransmissionRules = {
      ...commonTransmissionRules,
      invalidIdentificationsAndContactOutcome: {
        identifications: [
          {
            questionId: IdentificationQuestionsId.INDIVIDUAL_STATUS,
            value: IdentificationQuestionOptionValues.NOIDENT,
          },
        ],
        contactOutcome: contactOutcomes.REFUSAL.value,
      },
    };

    const mockSurveyUnit = {
      identification: {
        [IdentificationQuestionsId.INDIVIDUAL_STATUS]: IdentificationQuestionOptionValues.NOIDENT,
      },
      contactOutcome: {
        date: Date.now(),
        totalNumberOfContactAttempts: 4,
        type: contactOutcomes.INTERVIEW_ACCEPTED.value,
      },
    } as SurveyUnit;

    const result = isInvalidIdentificationAndContactOutcome(mockTransmissionRules, mockSurveyUnit);
    expect(result).toBe(false);
  });
});
