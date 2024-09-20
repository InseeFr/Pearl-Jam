import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
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
import { Box, DialogContent, DialogTitle } from '@mui/material';
import { mediumRadioValues, reasonRadioValues, typeRadioValues } from '../../utils/constants';

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

  let mediums = mediumRadioValues.map(m => {
    return {
      value: m.value,
      label: m.label,
      disabled: !communicationTemplates.some(c => c.medium === m.value),
    };
  });

  communicationTemplates = communicationTemplates.filter(
    item => item.medium === communicationRequest.medium
  );

  let types = typeRadioValues.map(t => {
    return {
      value: t.value,
      label: t.label,
      disabled: !communicationTemplates.some(c => c.type === t.value),
    };
  });

  let reasons = reasonRadioValues.map(r => {
    return {
      value: r.value,
      label: r.label,
      disabled: !communicationTemplates.some(
        c => c.type === communicationTypeEnum.COMMUNICATION_REMINDER.value
      ),
    };
  });

  // If reminder is not selected as a type, the user does not have to set a reason (therefore setting it automatically here)
  if (
    communicationRequest.type !== communicationTypeEnum.COMMUNICATION_REMINDER.value &&
    communicationRequest.reason !== communicationReasonEnum.UNREACHABLE.value
  )
    setCommunicationRequest({
      ...communicationRequest,
      reason: communicationReasonEnum.UNREACHABLE.value,
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

  const previousStep = () => {
    if (step !== Steps.MEDIUM) {
      setStep(Steps.before(step));
    }
  };

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
