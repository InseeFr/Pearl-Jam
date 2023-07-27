import { TITLES } from 'utils/constants';
import { communicationEmiterEnum } from 'utils/enum/CommunicationEnums';
import { getAddressData } from './surveyUnitFunctions';
import { icons } from 'utils/icons/materialIcons';
import { contactOutcomeEnum } from 'utils/enum/ContactOutcomeEnum';

export const canSendCommunication = surveyUnit => {
  // #1 communicationRequestConfiguration should be set to true
  const { communicationRequestConfiguration = false, contactOutcome } = surveyUnit;
  // #2 contactOutcome should be different from INTERVIEW_ACCEPTED
  return (
    communicationRequestConfiguration &&
    contactOutcome?.type !== contactOutcomeEnum.INTERVIEW_ACCEPTED.type
  );
};

export const getCommunicationIconFromType = emiter =>
  emiter.toUpperCase() === communicationEmiterEnum.INTERVIEWER ? icons.WALK : icons.TOOL;

export const VALID_MAIL_FORMAT = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const isEmailValid = email => email?.match(VALID_MAIL_FORMAT) ?? false;

export const isValidTitle = title => Object.keys(TITLES).includes(title.toUpperCase());
export const isValidString = string => !!string && string?.length !== 0;

export const checkCommunicationRequestFormAddressesValidity = (
  recipientInformation,
  userInformation,
  communicationRequest
) => {
  let userError = {
      title: true,
      name: true,
      emailAndPhoneNumber: true,
    },
    recipientError = {
      title: true,
      firstName: true,
      lastName: true,
      postCode: true,
      cityName: true,
    },
    communicationRequestError = { medium: true };

  if (communicationRequest !== undefined) {
    const { medium } = communicationRequest;
    communicationRequestError.medium = !medium;
  }
  if (userInformation !== undefined) {
    const { title, firstName, lastName, email, phoneNumber } = userInformation;
    userError.title = !isValidTitle(title);
    userError.name = !isValidString(lastName);
    userError.emailAndPhoneNumber =
      !isEmailValid(email) && (!phoneNumber || phoneNumber.length < 10);
  }
  if (recipientInformation !== undefined) {
    const {
      title,
      recipientFirstName,
      recipientLastName,
      recipientPostcode,
      recipientCityName,
    } = recipientInformation;
    recipientError.title = !isValidTitle(title);
    recipientError.firstName = !isValidString(recipientFirstName);
    recipientError.lastName = !isValidString(recipientLastName);
    recipientError.postCode = !isValidString(recipientPostcode);
    recipientError.cityName = !isValidString(recipientCityName);
  }

  return { userError, recipientError, communicationRequestError };
};

export const getRecipientInformation = surveyUnit => {
  const recipient = surveyUnit.persons?.find(p => p.privileged);
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
