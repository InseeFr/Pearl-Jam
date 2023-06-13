import {
  EMPTY_COMMUNICATION_REQUEST,
  mediumRadioValues,
  reasonRadioValues,
  typeRadioValues,
} from 'utils/constants';
import { useCallback, useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import { CommunicationRequestValidation } from './CommunicationRequestValidation';
import D from 'i18n';
import { FormRadioGroup } from './FormRadioGroup';
import Typography from '@material-ui/core/Typography';
import { checkCommunicationRequestFormAddressesValidity } from 'utils/functions/communicationFunctions';
import { communicationStatusEnum } from 'utils/enum/CommunicationEnums';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  title: {
    fontSize: '1.5em',
    justifySelf: 'center',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1em',
  },
}));

export const CommunicationRequestForm = ({
  closeModalFunction,
  saveFunction,
  userInformation,
  recipientInformation,
}) => {
  const classes = useStyles();

  const [communicationRequest, setCommunicationRequest] = useState(EMPTY_COMMUNICATION_REQUEST);
  const steps = [
    {
      title: D.selectCommunciationRequestMedium,
      valueName: 'medium',
      values: mediumRadioValues,
      previousLabel: D.cancelButton,
      nextLabel: D.confirmButton,
    },
    {
      title: D.selectCommunciationRequestType,
      valueName: 'type',
      values: typeRadioValues,
      previousLabel: D.previousButton,
      nextLabel: D.confirmButton,
    },
    {
      title: D.selectCommunciationRequestReason,
      valueName: 'reason',
      values: reasonRadioValues,
      previousLabel: D.previousButton,
      nextLabel: D.confirmButton,
    },
    {
      title: D.communicationRequestValidation,
      previousLabel: D.previousButton,
      nextLabel: D.sendButton,
    },
  ];
  const [selectedStep, setSelectedStep] = useState(steps[0]);

  const [currentAttributeIsValid, setCurrentAttributeIsValid] = useState(false);

  const getStepIndex = () => steps.findIndex(step => step.title === selectedStep.title);
  const isFirstStep = () => getStepIndex() === 0;
  const isLastStep = () => getStepIndex() === steps.length - 1;

  const generateCommunicationRequest = commRequ => ({
    ...commRequ,
    status: [{ date: new Date().getTime(), status: communicationStatusEnum.INIT.type }],
  });

  const nextStepAction = () => {
    if (isLastStep()) {
      saveFunction(generateCommunicationRequest(communicationRequest));
      closeModalFunction();
    } else {
      setSelectedStep(steps[getStepIndex() + 1]);
    }
  };

  const previousStepAction = () => {
    if (isFirstStep()) {
      closeModalFunction();
    } else {
      setSelectedStep(steps[getStepIndex() - 1]);
    }
  };

  const isValueValid = value => !!value;

  const isAddressingValid = () => {
    // TODO : add business rules here
    return true;
  };

  const checkValidity = useCallback((communicationRequest, selectedStep) => {
    if (selectedStep.valueName !== undefined)
      return isValueValid(communicationRequest[selectedStep.valueName]);

    return isAddressingValid();
  }, []);

  useEffect(() => {
    setCurrentAttributeIsValid(checkValidity(communicationRequest, selectedStep));
  }, [checkValidity, communicationRequest, selectedStep]);

  const handleChange = event => {
    const {
      target: { value },
    } = event;
    setCommunicationRequest({ ...communicationRequest, [selectedStep.valueName]: value });
  };
  const addressesErrors = checkCommunicationRequestFormAddressesValidity(
    recipientInformation,
    userInformation,
    communicationRequest
  );

  return (
    <>
      <Typography className={classes.title}>{selectedStep.title}</Typography>
      {selectedStep.valueName && (
        <FormRadioGroup
          groupSelectedValue={communicationRequest[selectedStep.valueName]}
          groupHandleChange={handleChange}
          groupValues={selectedStep.values}
        />
      )}
      {selectedStep.valueName === undefined && (
        <CommunicationRequestValidation
          communicationRequest={communicationRequest}
          recipientInformation={recipientInformation}
          userInformation={userInformation}
          addressesErrors={addressesErrors}
        />
      )}
      <div className={classes.buttons}>
        <Button variant="outlined" onClick={previousStepAction}>
          {selectedStep.previousLabel}
        </Button>
        <Button disabled={!currentAttributeIsValid} onClick={nextStepAction}>
          {selectedStep.nextLabel}
        </Button>
      </div>
    </>
  );
};
