import D from 'i18n';
import {
  SurveyUnit,
  SurveyUnitCommunicationRequest,
  SurveyUnitCommunicationTemplate,
} from 'types/pearl';
import {
  communicationStatusEnum,
  findCommunicationTypeLabelByValue,
  findCommunicationMediumLabelByValue,
  findCommunicationReasonLabelByValue,
  communicationTypeEnum,
} from 'utils/enum/CommunicationEnums';
import { formatDate } from 'utils/functions/date';
import { getAddressData, getprivilegedPerson } from './surveyUnitFunctions';

export type LastMailInfo = {
  type: string | undefined;
  medium: string | undefined;
  reason: string | undefined;
  date: number | null;
  template: SurveyUnitCommunicationTemplate | undefined;
};
function getMaxSubmittedDate(comReq: SurveyUnitCommunicationRequest): number | null {
  const submittedDates = comReq.status
    .filter(s => s.status === communicationStatusEnum.SUBMITTED.value)
    .map(s => s.date);

  return submittedDates.length > 0 ? Math.max(...submittedDates) : null;
}
export function getLastSubmittedCommunication(surveyUnit: SurveyUnit): LastMailInfo | null {
  const submittedComms = (surveyUnit.communicationRequests ?? [])
    .map(comReq => ({ comReq, date: getMaxSubmittedDate(comReq) }))
    .filter(
      (entry): entry is { comReq: SurveyUnitCommunicationRequest; date: number } =>
        entry.date !== null
    );

  if (submittedComms.length === 0) {
    return null;
  }

  const lastSubmitted = submittedComms.reduce(
    (prev, current) => (current.date > prev.date ? current : prev),
    submittedComms[0]
  );

  const template = surveyUnit.communicationTemplates?.find(
    t => t.id === lastSubmitted.comReq.communicationTemplateId
  );

  return {
    type: template?.type,
    medium: template?.medium,
    reason: lastSubmitted.comReq.reason,
    date: lastSubmitted.date,
    template,
  };
}

/**
 * Format the last mail info for display in the table.
 * Format: "{mediumLabel} - {typeLabel}[, {reasonLabel}] | {date}"
 */
export function formatLastMailInfo(lastMailInfo: LastMailInfo | null): string {
  if (!lastMailInfo?.date) {
    return D.noMailSent;
  }

  const typeLabel = findCommunicationTypeLabelByValue(lastMailInfo.type) ?? '';
  const mediumLabel = findCommunicationMediumLabelByValue(lastMailInfo.medium) ?? '';

  let displayText = `${mediumLabel} - ${typeLabel}`;

  if (
    lastMailInfo.type === communicationTypeEnum.COMMUNICATION_REMINDER.value &&
    lastMailInfo.reason
  ) {
    const reasonLabel = findCommunicationReasonLabelByValue(lastMailInfo.reason) ?? '';
    displayText += `, ${reasonLabel}`;
  }

  displayText += ` | ${formatDate(lastMailInfo.date)}`;

  return displayText;
}

export const getRecipientInformation = (surveyUnit: SurveyUnit) => {
  const recipient = getprivilegedPerson(surveyUnit);
  const { title, firstName, lastName } = recipient;

  const { address } = surveyUnit;
  const { postCode, cityName, elevator, cityPriorityDistrict, ...rest } = getAddressData(address);

  return {
    title: title,
    recipientFirstName: firstName,
    recipientLastName: lastName,
    recipientCityName: cityName,
    recipientPostcode: postCode,
    address: Object.values(rest),
  };
};
