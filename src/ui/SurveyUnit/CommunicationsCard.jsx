import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '../Typography';
import D from 'i18n';
import { Row } from '../Row';
import Stack from '@mui/material/Stack';
import React from 'react';
import Button from '@mui/material/Button';
import { useToggle } from '../../utils/hooks/useToggle';
import CampaignIcon from '@mui/icons-material/Campaign';
import AddIcon from '@mui/icons-material/Add';
import BuildIcon from '@mui/icons-material/Build';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import Divider from '@mui/material/Divider';
import { formatDate } from '../../utils/functions/date';
import {
  findCommunicationMediumValueByType,
  findCommunicationReasonValueByType,
  findCommunicationStatusValueByType,
  findCommunicationTypeValueByType,
} from '../../utils/enum/CommunicationEnums';
import { HEALTHY_COMMUNICATION_REQUEST_STATUS } from '../../utils/constants';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { CommunicationForm } from './CommunicationForm';
import { canSendCommunication } from '../../utils/functions';

/**
 * @param {SurveyUnit} surveyUnit
 */
export function CommunicationsCard({ surveyUnit }) {
  const [showModal, toggleModal] = useToggle(false);
  const canAddCommunication = canSendCommunication(surveyUnit);

  return (
    <>
      <Card p={2} elevation={0}>
        <CardContent>
          <Stack gap={3}>
            <Row gap={1}>
              <CampaignIcon fontSize="large" />
              <Typography as="h2" variant="xl" fontWeight={700}>
                {D.surveyUnitCommunications}
              </Typography>
            </Row>
            <Button
              disabled={!canAddCommunication}
              onClick={toggleModal}
              variant="contained"
              startIcon={<AddIcon />}
            >
              {D.sendCommunication}
            </Button>
            <Stack gap={2}>
              {surveyUnit.communicationRequests?.map(v => (
                <CommunicationItem communication={v} key={v.status[0].date ?? 1} />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      {showModal && <CommunicationForm surveyUnit={surveyUnit} onClose={toggleModal} />}
    </>
  );
}

/**
 * @param {SurveyUnitCommunicationRequest} communication
 * @constructor
 */
function CommunicationItem({ communication }) {
  const IconComponent =
    communication.emiter.toUpperCase() === 'INTERVIEWER' ? DirectionsWalkIcon : BuildIcon;
  const sortedStatus = [...communication.status].sort((s1, s2) => s1.date > s2.date);
  const firstStatus = sortedStatus.at(0);
  const lastStatus = sortedStatus.at(-1);
  const statusIcon = HEALTHY_COMMUNICATION_REQUEST_STATUS.includes(lastStatus.status) ? (
    <CheckIcon color="success" />
  ) : (
    <ClearIcon color="red" />
  );

  return (
    <Row
      bgcolor="surfacePrimary.main"
      px={1.5}
      py={2}
      borderRadius={1}
      justifyContent="space-between"
    >
      <Row gap={1.5}>
        <IconComponent color="textPrimary" />
        <Divider orientation="vertical" flexItem />
        <div>
          <Typography color="textTertiary" variant="s">
            {formatDate(firstStatus.date, true)}
          </Typography>
          <Typography color="textPrimary" variant="s">
            &nbsp;| {findCommunicationMediumValueByType(communication.medium)} -{' '}
            {findCommunicationTypeValueByType(communication.type)}
            {communication.reason &&
              `, ${findCommunicationReasonValueByType(communication.reason)}`}
          </Typography>
        </div>
      </Row>
      <Row gap={1.5} typography="s" color="textTertiary.main" fontWeight={600}>
        {findCommunicationStatusValueByType(lastStatus.status)} {D.communicationStatusOn}{' '}
        {formatDate(lastStatus.date)}
        {statusIcon}
      </Row>
    </Row>
  );
}
