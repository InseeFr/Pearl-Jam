import { COMMUNICATION_REQUEST_FORM_STEPS, EMPTY_COMMUNICATION_REQUEST } from 'utils/constants';
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

        const [communicationRequest, setCommunicationRequest] = useState(
          EMPTY_COMMUNICATION_REQUEST
        );
        const steps = COMMUNICATION_REQUEST_FORM_STEPS;
        const [selectedStep, setSelectedStep] = useState(steps[0]);

        const [currentStepIsValid, setCurrentStepIsValid] = useState(false);

        const getStepIndex = () => steps.findIndex(step => step.title === selectedStep.title);
        const isFirstStep = () => getStepIndex() === 0;
        const isLastStep = () => getStepIndex() === steps.length - 1;

        const generateCommunicationRequest = commRequ => ({
          ...commRequ,
          status: [{ date: new Date().getTime(), status: communicationStatusEnum.INITIATED.type }],
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

        const isAddressingValid = communicationRequest =>
          !Object.values(
            checkCommunicationRequestFormAddressesValidity(
              recipientInformation,
              userInformation,
              communicationRequest
            )
          )
            .map(Object.values)
            .flat()
            .some(error => error === true);

        useEffect(() => {
          const stepValidity =
            selectedStep.valueName !== undefined
              ? isValueValid(communicationRequest[selectedStep.valueName])
              : isAddressingValid(communicationRequest);

          setCurrentStepIsValid(stepValidity);
        }, [communicationRequest, selectedStep]);

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
            {selectedStep.valueName ? (
              <FormRadioGroup
                groupSelectedValue={communicationRequest[selectedStep.valueName]}
                groupHandleChange={handleChange}
                groupValues={selectedStep.values}
              />
            ) : (
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
              <Button disabled={!currentStepIsValid} onClick={nextStepAction}>
                {selectedStep.nextLabel}
              </Button>
            </div>
          </>
        );
      };