import BuildIcon from '@mui/icons-material/Build';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import Divider from '@mui/material/Divider';
import D from 'i18n';
import { formatDate } from '../../../utils/functions/date';
import { HEALTHY_COMMUNICATION_REQUEST_STATUS, reasonRadioValues } from '../../../utils/constants';
import {
  communicationReasonEnum,
  communicationTypeEnum,
  findCommunicationMediumLabelByValue,
  findCommunicationReasonLabelByValue,
  findCommunicationStatusLabelByValue,
  findCommunicationTypeLabelByValue,
} from '../../../utils/enum/CommunicationEnums';
import { Row } from '../../Row';
import { Typography } from '../../Typography';

interface CommunicationItemProps {
  communication: SurveyUnitCommunicationRequest;
  surveyUnitCommunicationTemplate: SurveyUnitCommunicationTemplate | undefined;
}
/**
 * @param {SurveyUnitCommunicationRequest} communication
 * @constructor
 */
export function CommunicationItem({
  communication,
  surveyUnitCommunicationTemplate,
}: CommunicationItemProps) {
  const IconComponent =
    communication.emitter.toUpperCase() === 'INTERVIEWER' ? DirectionsWalkIcon : BuildIcon;
  const sortedStatus = [...communication.status].sort((s1, s2) => s1.date - s2.date);
  const firstStatus = sortedStatus[0];
  const lastStatus = sortedStatus[sortedStatus.length - 1];
  const statusIcon = HEALTHY_COMMUNICATION_REQUEST_STATUS.includes(lastStatus.status) ? (
    <CheckIcon color="success" />
  ) : (
    <ClearIcon color="error" />
  );

  if (surveyUnitCommunicationTemplate === undefined) return;

  const mediumLabel = findCommunicationMediumLabelByValue(surveyUnitCommunicationTemplate.medium);
  const typeLabel = findCommunicationTypeLabelByValue(surveyUnitCommunicationTemplate.type);
  const reasonLabel =
    surveyUnitCommunicationTemplate.type !== communicationTypeEnum.COMMUNICATION_NOTICE.value
      ? `, ${findCommunicationReasonLabelByValue(communication.reason)}`
      : '';

  const lastStatusLabel = findCommunicationStatusLabelByValue(lastStatus.status);
  const formattedDate = formatDate(lastStatus.date);

  return (
    <Row
      bgcolor="surfacePrimary.main"
      px={1.5}
      py={2}
      borderRadius={1}
      justifyContent="space-between"
    >
      <Row gap={1.5}>
        <IconComponent color="primary" />
        <Divider orientation="vertical" flexItem />
        <div>
          <Typography color="textTertiary" variant="s">
            {formatDate(firstStatus.date, true)}
          </Typography>
          <Typography color="textPrimary" variant="s">
            {` | ${mediumLabel} - ${typeLabel}${reasonLabel}`}
          </Typography>
        </div>
      </Row>
      <Row gap={1.5} typography="s" color="textTertiary.main" fontWeight={600}>
        {`${lastStatusLabel} ${D.communicationStatusOn} ${formattedDate}`} {statusIcon}
      </Row>
    </Row>
  );
}
