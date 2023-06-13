import { getAddressData } from './surveyUnitFunctions';
import { icons } from 'utils/icons/materialIcons';

export const canSendCommunication = surveyUnit => {
  // TODO : insert business rules here
  return true;
};

export const getCommunicationIconFromType = emiter =>
  emiter.toUpperCase() === 'INTERVIEWER' ? icons.WALK : icons.TOOL;

export const VALID_MAIL_FORMAT = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const isEmailValid = email => email?.match(VALID_MAIL_FORMAT) ?? false;

export const checkCommunicationRequestFormAddressesValidity = (
  recipientInformation,
  userInformation,
  communicationRequest
) => {
  let userError = {
      civility: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
    },
    recipientError = {
      civility: true,
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
    const { civility, firstName, lastName, email, phoneNumber } = userInformation;
    userError.civility = !['MISTER', 'MISS'].includes(civility);
    userError.firstName = !firstName || firstName.length === 0;
    userError.lastName = !lastName || lastName.length === 0;
    userError.email = !isEmailValid(email);
    userError.phoneNumber = !phoneNumber || phoneNumber.length < 10;
  }
  if (recipientInformation !== undefined) {
    const {
      civility,
      recipientFirstName,
      recipientLastName,
      recipientPostcode,
      recipientCityName,
    } = recipientInformation;
    recipientError.civility = !['MISTER', 'MISS'].includes(civility);
    recipientError.firstName = !recipientFirstName || recipientFirstName.length === 0;
    recipientError.lastName = !recipientLastName || recipientLastName.length === 0;
    recipientError.postCode = !recipientPostcode || recipientPostcode.length === 0;
    recipientError.cityName = !recipientCityName || recipientCityName.length === 0;
  }

  return { userError, recipientError, communicationRequestError };
};

export const getRecipientInformation = surveyUnit => {
  const recipient = surveyUnit.persons?.find(p => p.privileged);
  const { title, firstName, lastName } = recipient;

  const { address } = surveyUnit;
  const { postCode, cityName, elevator, cityPriorityDistrict, ...rest } = getAddressData(address);

  return {
    civility: title,
    recipientFirstName: firstName,
    recipientLastName: lastName,
    recipientCityName: cityName,
    recipientPostcode: postCode,
    address: Object.values(rest),
  };
};
