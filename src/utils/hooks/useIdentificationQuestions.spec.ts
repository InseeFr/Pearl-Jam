import { SurveyUnit } from 'types/pearl';
import {
  IdentificationConfiguration,
  IdentificationQuestionsId,
} from 'utils/enum/identifications/IdentificationsQuestions';
import { vi, expect, it } from 'vitest';
import { useIdentificationQuestions } from './useIdentificationQuestions';
import { act, renderHook } from '@testing-library/react';
import {
  IdentificationQuestionOption,
  getIdentificationQuestionsTree,
} from 'utils/functions/identifications/identificationFunctions';
import { optionsMap } from 'utils/functions/identifications/questionsTree/optionsMap';
import D from 'i18n';
import * as utilsFunctions from 'utils/functions';

vi.mock('utils/functions', { spy: true });

let mockSurveyUnit: SurveyUnit = {
  identificationConfiguration: IdentificationConfiguration.NOIDENT,
  identification: {},
  states: [],
  displayName: '',
  id: '',
  persons: [],
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
  campaign: '',
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
  campaignLabel: '',
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
};

const identificationQuestionsHookTests = [
  {
    surveyUnitInput: {
      ...mockSurveyUnit,
      identificationConfiguration: IdentificationConfiguration.IASCO,
      identification: {},
    },

    output: {
      availability: {
        identification: true,
        access: true,
        situation: true,
        category: true,
        occupant: true,
      },
      responses: {
        identification: undefined,
        access: undefined,
        situation: undefined,
        category: undefined,
        occupant: undefined,
      },
      questions: getIdentificationQuestionsTree(IdentificationConfiguration.IASCO, {}),
      handleReponse: vi.fn as (
        selectedQuestionId: IdentificationQuestionsId,
        option: IdentificationQuestionOption
      ) => void,
    },
  },
  {
    surveyUnitInput: {
      ...mockSurveyUnit,
      identificationConfiguration: IdentificationConfiguration.NOIDENT,
      identification: {},
    },
    output: {
      availability: {},
      responses: {},
      questions: getIdentificationQuestionsTree(IdentificationConfiguration.NOIDENT, {}),
      handleReponse: vi.fn as (
        selectedQuestionId: IdentificationQuestionsId,
        option: IdentificationQuestionOption
      ) => void,
    },
  },
  {
    surveyUnitInput: {
      ...mockSurveyUnit,
      identificationConfiguration: IdentificationConfiguration.SRCVREINT,
      identification: {
        numberOfRespondents: optionsMap.MANY.value,
        individualStatus: optionsMap.OTHER_ADDRESS.value,
        householdComposition: optionsMap.SAME_COMPO.value,
      },
    },
    output: {
      availability: {
        numberOfRespondents: true,
        individualStatus: true,
        householdComposition: true,
        presentInPreviousHome: false,
        situation: true,
      },
      responses: {
        numberOfRespondents: optionsMap.MANY,
        individualStatus: { ...optionsMap.OTHER_ADDRESS, label: D.otherHouse },
        householdComposition: optionsMap.SAME_COMPO,
        presentInPreviousHome: undefined,
        situation: undefined,
      },
      questions: getIdentificationQuestionsTree(IdentificationConfiguration.SRCVREINT, {
        numberOfRespondents: optionsMap.MANY.value,
        individualStatus: optionsMap.OTHER_ADDRESS.value,
        householdComposition: optionsMap.SAME_COMPO.value,
      }),
      handleReponse: vi.fn as (
        selectedQuestionId: IdentificationQuestionsId,
        option: IdentificationQuestionOption
      ) => void,
    },
  },
  {
    surveyUnitInput: {
      ...mockSurveyUnit,
      identificationConfiguration: IdentificationConfiguration.INDTEL,
      identification: {
        individualStatus: optionsMap.OTHER_ADDRESS.value,
      },
    },
    output: {
      availability: {
        situation: true,
        individualStatus: true,
      },
      responses: {
        individualStatus: optionsMap.OTHER_ADDRESS,
        situation: undefined,
      },
      questions: getIdentificationQuestionsTree(IdentificationConfiguration.INDTEL, {
        individualStatus: optionsMap.OTHER_ADDRESS.value,
      }),
      handleReponse: vi.fn as (
        selectedQuestionId: IdentificationQuestionsId,
        option: IdentificationQuestionOption
      ) => void,
    },
  },
];

const identificationQuestionsHookSetReponseTests = [
  {
    // IASCO
    surveyUnitInput: identificationQuestionsHookTests[0].surveyUnitInput,
    setResponseCallParameters: {
      identificationQuestionsId: IdentificationQuestionsId.IDENTIFICATION,
      option: { ...optionsMap.DESTROY, concluding: true },
    },
    output: {
      availability: {
        identification: true,
        access: false,
        situation: false,
        category: false,
        occupant: false,
      },
      responses: {
        identification: optionsMap.DESTROY,
        access: undefined,
        situation: undefined,
        category: undefined,
        occupant: undefined,
      },
      persistSurveyUnitIdentificationCall: true,
      addNewStateCall: true,
    },
  },
  {
    // NOIDENT
    surveyUnitInput: identificationQuestionsHookTests[1].surveyUnitInput,
    setResponseCallParameters: undefined,
    output: {
      availability: {},
      responses: {},
    },
  },
  {
    // SRCV
    surveyUnitInput: identificationQuestionsHookTests[2].surveyUnitInput,
    setResponseCallParameters: {
      identificationQuestionsId: IdentificationQuestionsId.SITUATION,
      option: { ...optionsMap.NOORDINARY, concluding: true },
    },
    output: {
      availability: {
        numberOfRespondents: true,
        individualStatus: true,
        householdComposition: true,
        presentInPreviousHome: false,
        situation: true,
      },
      responses: {
        numberOfRespondents: optionsMap.MANY,
        individualStatus: { ...optionsMap.OTHER_ADDRESS, label: D.otherHouse },
        householdComposition: optionsMap.SAME_COMPO,
        presentInPreviousHome: undefined,
        situation: optionsMap.NOORDINARY,
      },
      persistSurveyUnitIdentificationCall: true,
      addNewStateCall: true,
    },
  },
  {
    // SRCV 2
    surveyUnitInput: identificationQuestionsHookTests[2].surveyUnitInput,
    setResponseCallParameters: {
      identificationQuestionsId: IdentificationQuestionsId.NUMBER_OF_RESPONDENTS,
      option: { ...optionsMap.ONE, concluding: false },
    },
    output: {
      availability: {
        numberOfRespondents: true,
        individualStatus: true,
        householdComposition: false,
        presentInPreviousHome: false,
        situation: true,
      },
      responses: {
        numberOfRespondents: optionsMap.ONE,
        individualStatus: undefined,
        householdComposition: undefined,
        presentInPreviousHome: undefined,
        situation: undefined,
      },
      persistSurveyUnitIdentificationCallCount: 1,
      nextDialog: IdentificationQuestionsId.INDIVIDUAL_STATUS,
    },
  },
  {
    // INDTEL
    surveyUnitInput: identificationQuestionsHookTests[3].surveyUnitInput,
    setResponseCallParameters: {
      identificationQuestionsId: IdentificationQuestionsId.SITUATION,
      option: { ...optionsMap.ORDINARY, concluding: true },
    },
    output: {
      availability: {
        situation: true,
        individualStatus: true,
      },
      responses: {
        situation: optionsMap.ORDINARY,
        individualStatus: optionsMap.OTHER_ADDRESS,
      },
      persistSurveyUnitIdentificationCallCount: 1,
      addNewStateCallCount: 1,
    },
  },
];

identificationQuestionsHookTests.forEach(({ surveyUnitInput, output }) => {
  it(`Initilization for useIdentificationQuestions should return ${output} when adding ${surveyUnitInput}`, () => {
    const { result, rerender } = renderHook(() => useIdentificationQuestions(surveyUnitInput));

    act(() => {
      // trigger useEffect
      rerender({ ...surveyUnitInput, displayName: 'test' });
    });

    const { root, ...questions } = output.questions;
    expect(result.current.availableQuestions).toStrictEqual(output.availability);
    expect(result.current.responses).toMatchObject(output.responses);
    expect(result.current.questions).toMatchObject(questions);
    expect(result.current.handleResponseCallback).toBeTypeOf(typeof output.handleReponse);
    expect(result.current.selectedDialogId).toBeUndefined();
  });
});

identificationQuestionsHookSetReponseTests.forEach(
  ({ surveyUnitInput, setResponseCallParameters, output }) => {
    it(`SetResponse for useIdentificationQuestions should return ${output} when adding ${surveyUnitInput} and calling ${setResponseCallParameters}`, () => {
      const { result } = renderHook(() => useIdentificationQuestions(surveyUnitInput));

      const spyPersistSurveyUnit = vi.spyOn(utilsFunctions, 'persistSurveyUnit');
      const addNewState = vi.spyOn(utilsFunctions, 'addNewState');

      act(() => {
        if (setResponseCallParameters)
          result.current.handleResponseCallback(
            setResponseCallParameters.identificationQuestionsId,
            setResponseCallParameters.option
          );
      });

      if (output.persistSurveyUnitIdentificationCall) expect(spyPersistSurveyUnit).toBeCalled();
      if (output.addNewStateCall) expect(addNewState).toBeCalled();

      expect(result.current.availableQuestions).toStrictEqual(output.availability);
      expect(result.current.responses).toMatchObject(output.responses);
      expect(result.current.selectedDialogId).toEqual(output.nextDialog);
    });
  }
);
