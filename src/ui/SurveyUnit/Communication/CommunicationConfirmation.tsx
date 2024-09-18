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
