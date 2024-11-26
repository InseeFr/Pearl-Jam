import { getAddressData, getprivilegedPerson } from './surveyUnitFunctions';
import { contactOutcomeEnum } from 'utils/enum/ContactOutcomeEnum';

export const canSendCommunication = surveyUnit => {
  // #1 communicationRequestConfiguration should be set to true
  const { communicationRequestConfiguration = false, contactOutcome } = surveyUnit;
  // #2 contactOutcome should be different from INTERVIEW_ACCEPTED
  return (
    communicationRequestConfiguration &&
    contactOutcome?.type !== contactOutcomeEnum.INTERVIEW_ACCEPTED.value
  );
};

export const getRecipientInformation = surveyUnit => {
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
