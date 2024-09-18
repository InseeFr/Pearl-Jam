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
import { Box, DialogContent, DialogTitle, Step } from '@mui/material';
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

  const nextStep = () => {
    if (step < Steps.VALIDATE) setStep(Steps.after(step));
  };

  const previousStep = () => {
    if (!isFirst) {
      setStep(Steps.before(step));
    }
  };
  return (
    <Dialog maxWidth="sm" open={true} onClose={onClose()}>
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
