import { Fragment, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { Typography } from '../../Typography';
import { ValidationError } from '../../ValidationError';
import { communicationSchema, recipientSchema, userSchema } from '../../../utils/schemas';
import { useUser } from '../../../utils/hooks/useUser';
import { getAddressData, getprivilegedPerson, getTitle } from '../../../utils/functions';
import { CommunicationForm } from '../CommunicationForm';
import D from './../../../i18n';
import {
  findCommunicationMediumLabelByValue,
  findCommunicationReasonLabelByValue,
  findCommunicationTypeLabelByValue,
} from '../../../utils/enum/CommunicationEnums';

interface CommunicationConfirmationProps {
  surveyUnit: SurveyUnit;
  communication: CommunicationForm;
  onValidationChange : React.Dispatch<React.SetStateAction<boolean>>
}

const CommunicationConfirmation = ({
  communication,
  surveyUnit,
  onValidationChange,
}: CommunicationConfirmationProps) => {

  const address = getAddressData(surveyUnit.address);
  const addressLines = Object.values(address).filter(v => !!v);
  const recipient = getprivilegedPerson(surveyUnit);
  const { user } = useUser();

  const userError = userSchema.safeParse(user);
  const recipientError = recipientSchema.safeParse({ ...address, ...recipient });
  const communicationError = communicationSchema.safeParse(communication);

  useEffect(() => {    
    onValidationChange(userError.success && recipientError.success && communicationError.success);
  }, []);

