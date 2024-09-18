import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '../Typography';
import D from 'i18n';
import { Row } from '../Row';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useToggle } from '../../utils/hooks/useToggle';
import CampaignIcon from '@mui/icons-material/Campaign';
import AddIcon from '@mui/icons-material/Add';
import BuildIcon from '@mui/icons-material/Build';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import Divider from '@mui/material/Divider';
import { formatDate } from '../../utils/functions/date';
import {
  findCommunicationMediumLabelByValue,
  findCommunicationReasonLabelByValue,
  findCommunicationStatusValueByType,
  findCommunicationTypeLabelByValue,
} from '../../utils/enum/CommunicationEnums';
import { HEALTHY_COMMUNICATION_REQUEST_STATUS } from '../../utils/constants';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { CommunicationForm } from './CommunicationForm';
import { canSendCommunication } from '../../utils/functions';

