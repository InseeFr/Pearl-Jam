import Dialog from '@mui/material/Dialog';
import { useMemo, useState } from 'react';
import D from '../../../i18n/build-dictionary';
import { surveyUnitIDBService } from '../../../utils/indexeddb/services/surveyUnit-idb-service';
import {
  communicationReasonEnum,
  communicationStatusEnum,
  communicationTypeEnum,
} from '../../../utils/enum/CommunicationEnums';
import CommunicationDialogContent from './CommunicationDialogContent';
import CommunicationConfirmation from './CommunicationConfirmation';
import { mediumRadioValues, reasonRadioValues, typeRadioValues } from '../../../utils/constants';
import { SurveyUnit, SurveyUnitCommunicationRequest } from 'types/pearl';

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

export interface CommunicationRequestRadioData {
  value: string;
  label: string;
  disabled: boolean;
}

export interface CommunicationRequestForm {
  medium?: string;
  reason?: string;
  type?: string;
}

interface CommunicationFormProps {
  onClose: () => void;
  surveyUnit: SurveyUnit;
}

/**
 * Form to add a new communication request to a survey unit *
 * @param {() => void} onClose
 * @param {SurveyUnit} surveyUnit
 * @returns {TSX.Element}
 */
export function CommunicationForm({ onClose, surveyUnit }: Readonly<CommunicationFormProps>) {
  const [step, setStep] = useState(Steps.MEDIUM);
  const [communicationRequest, setCommunicationRequest] = useState<CommunicationRequestForm>({
    medium: '',
    reason: '',
    type: '',
  });

  const setCommunicationRequestPropValue = (value: string) => {
    const prop = Steps[step].toLocaleLowerCase();
    setCommunicationRequest({ ...communicationRequest, [prop]: value });
  };

  const bypassTypeValue = communicationTypeEnum.COMMUNICATION_NOTICE.value;
  const bypassReasonValue = communicationReasonEnum.UNREACHABLE.value;

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

  const options = useMemo(() => {
    if (bypassed) return;

    // If reminder is not selected as a type, the user does not have to set a reason (therefore setting it automatically here)
    if (bypass) {
      setCommunicationRequest({
        ...communicationRequest,
        reason: bypassReasonValue,
      });

      nextStep();
      return;
    }

    const setRadioValue = (prop: string, options: CommunicationRequestRadioData[]) => {
      return options.find(
        o => o.value === communicationRequest[prop as keyof CommunicationRequestForm] && !o.disabled
      )
        ? communicationRequest[prop as keyof CommunicationRequestForm]
        : (options.find(o => !o.disabled)?.value ?? undefined);
    };

    let communicationTemplates = surveyUnit?.communicationTemplates ?? [];
    const mediums: CommunicationRequestRadioData[] = mediumRadioValues.map(m => {
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

    const types: CommunicationRequestRadioData[] = typeRadioValues.map(t => {
      return {
        value: t.value,
        label: t.label,
        disabled: !communicationTemplates.some(c => c.type === t.value),
      };
    });
    const reasons: CommunicationRequestRadioData[] = reasonRadioValues.map(r => {
      return {
        value: r.value,
        label: r.label,
        disabled: !communicationTemplates.some(c => c.type !== bypassTypeValue),
      };
    });
    const mediumValue = setRadioValue('medium', mediums);
    const typeValue = setRadioValue('type', types);
    const reasonValue = setRadioValue('reason', reasons);

    setCommunicationRequest({ medium: mediumValue, reason: reasonValue, type: typeValue });
    return { mediums, types, reasons };
  }, [step]);

  const saveCommunicationRequest = () => {
    // Retrieveing communicationTemplatedId by using form's input from the user
    const communicationTemplatedId = surveyUnit?.communicationTemplates.find(
      communicationTemplate =>
        communicationTemplate.type === communicationRequest.type &&
        communicationTemplate.medium === communicationRequest.medium
    )?.id;

    const newCommunicationRequest: SurveyUnitCommunicationRequest = {
      reason: communicationRequest.reason,
      emitter: 'INTERVIEWER',
      communicationTemplateId: communicationTemplatedId,
      status: [{ date: new Date().getTime(), status: communicationStatusEnum.INITIATED.value }],
    };

    surveyUnitIDBService.addOrUpdateSU({
      ...surveyUnit,
      communicationRequests: [...(surveyUnit.communicationRequests ?? []), newCommunicationRequest],
    });

    onClose();
  };

  return (
    <Dialog maxWidth="sm" open={true} onClose={onClose}>
      {step == Steps.MEDIUM && (
        <CommunicationDialogContent
          title={D.selectCommunciationRequestMedium}
          options={options?.mediums}
          radioValue={communicationRequest.medium}
          isFirst={true}
          nextStep={nextStep}
          onClose={onClose}
          previousStep={previousStep}
          onChange={setCommunicationRequestPropValue}
        ></CommunicationDialogContent>
      )}
      {step == Steps.TYPE && (
        <CommunicationDialogContent
          title={D.selectCommunciationRequestType}
          options={options?.types}
          radioValue={communicationRequest.type}
          nextStep={nextStep}
          onClose={onClose}
          previousStep={previousStep}
          isFirst={false}
          onChange={setCommunicationRequestPropValue}
        ></CommunicationDialogContent>
      )}
      {step == Steps.REASON && (
        <CommunicationDialogContent
          title={D.selectCommunciationRequestReason}
          options={options?.reasons}
          radioValue={communicationRequest.reason}
          nextStep={nextStep}
          onClose={onClose}
          previousStep={previousStep}
          isFirst={false}
          onChange={setCommunicationRequestPropValue}
        ></CommunicationDialogContent>
      )}
      {step == Steps.VALIDATE && (
        <CommunicationConfirmation
          communication={communicationRequest}
          surveyUnit={surveyUnit}
          previousStep={previousStep}
          saveCommunicationRequest={saveCommunicationRequest}
          bypassReasonLabel={bypassed}
        />
      )}
    </Dialog>
  );
}
export default CommunicationDialogContent;
