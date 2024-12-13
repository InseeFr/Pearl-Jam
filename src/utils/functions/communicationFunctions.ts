import { SurveyUnit } from 'types/pearl';
import { getAddressData, getprivilegedPerson } from './surveyUnitFunctions';

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
