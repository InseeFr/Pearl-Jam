import BuildIcon from '@mui/icons-material/Build';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import Divider from '@mui/material/Divider';
import D from 'i18n';
import { formatDate } from '../../../utils/functions/date';
import { HEALTHY_COMMUNICATION_REQUEST_STATUS } from '../../../utils/constants';
import {
    findCommunicationMediumLabelByValue,
    findCommunicationReasonLabelByValue,
    findCommunicationStatusValueByType,
    findCommunicationTypeLabelByValue,
} from '../../../utils/enum/CommunicationEnums';
import { Row } from '../../Row';
import { Typography } from '../../Typography';


interface CommunicationItemProps
{
  communication : SurveyUnitCommunicationRequest
  surveyUnitCommunicationTemplate : SurveyUnitCommunicationTemplate | undefined
}
/**
 * @param {SurveyUnitCommunicationRequest} communication
 * @constructor
 */
export function CommunicationItem({ communication, surveyUnitCommunicationTemplate } : CommunicationItemProps) {
  const IconComponent =
    communication.emitter.toUpperCase() === 'INTERVIEWER' ? DirectionsWalkIcon : BuildIcon;
  const sortedStatus = [...communication.status].sort((s1, s2) => s1.date > s2.date);
  const firstStatus = sortedStatus.at(0);
  const lastStatus = sortedStatus.at(-1);
  const statusIcon = HEALTHY_COMMUNICATION_REQUEST_STATUS.includes(lastStatus.status) ? (
    <CheckIcon color="success" />
  ) : (
    <ClearIcon color="error" />
  );

  console.log(communication);
  console.log(surveyUnitCommunicationTemplate);
  
  if(surveyUnitCommunicationTemplate === undefined)
    return

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
            &nbsp;| {findCommunicationMediumLabelByValue(surveyUnitCommunicationTemplate.medium)} -{' '}
            {findCommunicationTypeLabelByValue(surveyUnitCommunicationTemplate.type)}
            {communication.reason &&
              `, ${findCommunicationReasonLabelByValue(communication.reason)}`}
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
