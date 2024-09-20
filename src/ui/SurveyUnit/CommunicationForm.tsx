import Dialog from '@mui/material/Dialog';
import { useState } from 'react';
import D from '../../i18n/build-dictionary';
import { surveyUnitIDBService } from '../../utils/indexeddb/services/surveyUnit-idb-service';
import {
  communicationReasonEnum,
  communicationStatusEnum,
  communicationTypeEnum,
} from '../../utils/enum/CommunicationEnums';
import CommunicationDialogContent from './Communication/CommunicationDialogContent';
import CommunicationConfirmation from './Communication/CommunicationConfirmation';
import { mediumRadioValues, reasonRadioValues, typeRadioValues } from '../../utils/constants';
import { validateDate } from '@mui/x-date-pickers/internals';

enum Steps {
  MEDIUM,
  TYPE,
  REASON,
  VALIDATE,
}

namespace Steps {
  export function after(value: Steps): Steps {
    return value + 1;
  }

  export function before(value: Steps): Steps {
    return value - 1;
  }
}

export interface CommunicationForm {
  medium: string;
  reason: string;
  type: string;
}

interface CommunicationFormProps {
  onClose: () => void;
  surveyUnit: SurveyUnit;
}

/**
 * Form to add a new contact attempt to a survey unit
 *
 * @param {() => void} onClose
 * @param {SurveyUnit} surveyUnit
 * @returns {TSX.Element}
 */
export function CommunicationForm({ onClose, surveyUnit }: CommunicationFormProps) {
  const [step, setStep] = useState(Steps.MEDIUM);
  const [communicationRequest, setCommunicationRequest] = useState<CommunicationForm>({
    medium: '',
    reason: '',
    type: '',
  });

  let communicationTemplates = surveyUnit?.communicationTemplates ?? [];

  const mediums = mediumRadioValues.map(m => {
    return {
      value: m.value,
      label: m.label,
      disabled: !communicationTemplates.some(c => c.medium === m.value),
    };
  });

  // Will allow the user to pick only the types found in communicationTemplates with the same medium as the one picked by the user (communicationRequest.medium)
  communicationTemplates = communicationTemplates.filter(
    item => item.medium === communicationRequest.medium
  );

  const types = typeRadioValues.map(t => {
    return {
      value: t.value,
      label: t.label,
      disabled: !communicationTemplates.some(c => c.type === t.value),
    };
  });

  const bypassTypeValue = communicationTypeEnum.COMMUNICATION_NOTICE.value;
  const bypassReasonValue = communicationReasonEnum.UNREACHABLE.value;

  const reasons = reasonRadioValues.map(r => {
    return {
      value: r.value,
      label: r.label,
      disabled: !communicationTemplates.some(c => c.type !== bypassTypeValue),
    };
  });

  const saveCommunicationRequest = () => {
    // Retrieveing communicationTemplatedId by using form's input from the user
    const communicationTemplatedId = communicationTemplates.find(
      communicationTemplate =>
        communicationTemplate.type === communicationRequest.type &&
        communicationTemplate.medium === communicationRequest.medium
    )?.id;

    const newCommunicationRequest = {
      reason: communicationRequest.reason,
      emitter: 'INTERVIEWER',
      communicationTemplateId: communicationTemplatedId,
      status: [{ date: new Date().getTime(), status: communicationStatusEnum.INITIATED.type }],
    } as SurveyUnitCommunicationRequest;

    surveyUnitIDBService.addOrUpdateSU({
      ...surveyUnit,
      communicationRequests: [...(surveyUnit.communicationRequests ?? []), newCommunicationRequest],
    });

    onClose();
  };

  const setValue = (value: string, prop: string) => {
    setCommunicationRequest({
      ...communicationRequest,
      [prop]: value,
    });
  };

  const nextStep = () => {
    if (step < Steps.VALIDATE) setStep(Steps.after(step));
  };

  const bypass = communicationRequest.type === bypassTypeValue && step === Steps.REASON;
  const bypassed = communicationRequest.type === bypassTypeValue && step === Steps.VALIDATE;

  const previousStep = () => {
    if (bypassed) {
      setStep(Steps.before(Steps.before(step)));
    } else if (step !== Steps.MEDIUM) {
      setStep(Steps.before(step));
    }
  };

  // If reminder is not selected as a type, the user does not have to set a reason (therefore setting it automatically here)
  if (bypass) {
    setCommunicationRequest({
      ...communicationRequest,
      reason: bypassReasonValue,
    });

    nextStep();
  }

  return (
    <Dialog maxWidth="sm" open={true} onClose={onClose}>
      {step == Steps.MEDIUM && (
        <CommunicationDialogContent
          title={D.selectCommunciationRequestMedium}
          step={'medium'}
          options={mediums}
          setCommunicationValue={setValue}
          lastPickedPropValue={communicationRequest.medium}
          isFirst={true}
          nextStep={nextStep}
          onClose={onClose}
          previousStep={previousStep}
        ></CommunicationDialogContent>
      )}
      {step == Steps.TYPE && (
        <CommunicationDialogContent
          title={D.selectCommunciationRequestType}
          step={'type'}
          options={types}
          setCommunicationValue={setValue}
          lastPickedPropValue={communicationRequest.type}
          nextStep={nextStep}
          onClose={onClose}
          previousStep={previousStep}
          isFirst={false}
        ></CommunicationDialogContent>
      )}
      {step == Steps.REASON && (
        <CommunicationDialogContent
          title={D.selectCommunciationRequestReason}
          step={'reason'}
          options={reasons}
          setCommunicationValue={setValue}
          lastPickedPropValue={communicationRequest.reason}
          nextStep={nextStep}
          onClose={onClose}
          previousStep={previousStep}
          isFirst={false}
        ></CommunicationDialogContent>
      )}
      {step == Steps.VALIDATE && (
        <CommunicationConfirmation
          communication={communicationRequest}
          surveyUnit={surveyUnit}
          previousStep={previousStep}
          saveCommunicationRequest={saveCommunicationRequest}
        />
      )}
    </Dialog>
  );
}
export default CommunicationDialogContent;
