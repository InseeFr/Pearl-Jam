import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useState } from 'react';
import D from '../../i18n/build-dictionary';
import { surveyUnitIDBService } from '../../utils/indexeddb/services/surveyUnit-idb-service';
import {
  communicationMediumEnum,
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
  const [comRequestValidity, setComRequestValidity] = useState(false);
  const [communicationRequest, setCommunicationRequest] = useState<CommunicationForm>({
    medium: '',
    reason: '',
    type: '',
  });

  // const communicationTemplates = surveyUnit?.communicationTemplates ?? [];
  let communicationTemplates = [
    {
      medium: communicationMediumEnum.MEDIUM_EMAIL,
      type: communicationTypeEnum.COMMUNICATION_NOTICE,
      id: 1,
    },
    {
      medium: communicationMediumEnum.MEDIUM_MAIL,
      type: communicationTypeEnum.COMMUNICATION_REMINDER,
      id: 2,
    },
    {
      medium: communicationMediumEnum.MEDIUM_EMAIL,
      type: communicationTypeEnum.COMMUNICATION_NOTICE,
      id: 3,
    },
  ];

  let mediums = mediumRadioValues.map(m => {
    return {
      value: m.value,
      label: m.label,
      disabled: !communicationTemplates.some(c => c.medium.value === m.value),
    };
  });

  communicationTemplates = communicationTemplates.filter(
    item => item.medium.value === communicationRequest.medium
  );

  let types = typeRadioValues.map(t => {
    return {
      value: t.value,
      label: t.label,
      disabled: !communicationTemplates.some(c => c.type.value === t.value),
    };
  });

  let reasons = reasonRadioValues.map(r => {
    return {
      value: r.value,
      label: r.label,
      disabled: !communicationTemplates.some(
        c => c.type.value === communicationTypeEnum.COMMUNICATION_REMINDER.value
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
        communicationTemplate.type.value === communicationRequest.type &&
        communicationTemplate.medium.value === communicationRequest.medium
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
    setCommunicationRequest({ medium: '', reason: '', type: '' });
  };

  const setValue = (value: string, prop: string) => {
    setCommunicationRequest({
      ...communicationRequest,
      [prop]: value,
    });
  };

  const isFirst = step === Steps.MEDIUM;

  const nextStep = () => {
    if (step < Steps.VALIDATE) setStep(Steps.after(step));
  };

  const previousStep = () => {
    if (!isFirst) {
      setStep(Steps.before(step));
    }
  };

  // if (
  //   step === Steps.REASON &&
  //   communicationRequest.type != communicationTypeEnum.COMMUNICATION_REMINDER.value
  // ) {
  //   setCommunicationRequest({
  //     ...communicationRequest,
  //     reason: communicationReasonEnum.UNREACHABLE.value,
  //   });
  //   setUnreachableNotice(true);
  //   nextStep();
  // }

  return (
    <Dialog maxWidth="sm" open={true} onClose={onClose}>
      {step == Steps.MEDIUM && (
        <CommunicationDialogContent
          title={D.selectCommunciationRequestMedium}
          step={'medium'}
          options={mediums}
          setCommunicationValue={setValue}
          lastPickedPropValue={communicationRequest.medium}
        ></CommunicationDialogContent>
      )}
      {step == Steps.TYPE && (
        <CommunicationDialogContent
          title={D.selectCommunciationRequestType}
          step={'type'}
          options={types}
          setCommunicationValue={setValue}
          lastPickedPropValue={communicationRequest.type}
        ></CommunicationDialogContent>
      )}
      {step == Steps.REASON && (
        <CommunicationDialogContent
          title={D.selectCommunciationRequestReason}
          step={'reason'}
          options={reasons}
          setCommunicationValue={setValue}
          lastPickedPropValue={communicationRequest.reason}
        ></CommunicationDialogContent>
      )}
      {step == Steps.VALIDATE && (
        <>
          <DialogTitle id="dialogtitle">{D.communicationRequestValidation}</DialogTitle>
          <DialogContent>
            <Box>
              <CommunicationConfirmation
                communication={communicationRequest}
                surveyUnit={surveyUnit}
                onValidationChange={setComRequestValidity}
              />
            </Box>
          </DialogContent>
        </>
      )}
      <DialogActions>
        <Button
          color="white"
          variant="contained"
          onClick={() => (isFirst ? onClose() : previousStep())}
        >
          {isFirst ? D.cancelButton : D.previousButton}
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            step == Steps.VALIDATE && comRequestValidity ? saveCommunicationRequest() : nextStep()
          }
        >
          {D.confirmButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default CommunicationDialogContent;
