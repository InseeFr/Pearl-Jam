import { TITLES } from 'utils/constants';
import { getRecipientInformation } from 'utils/functions/index';

describe('getRecipientInformation', () => {
  const VALID_FIRSTNAME1 = 'Ada';
  const VALID_LASTNAME1 = 'Lovelace';
  const VALID_FIRSTNAME2 = 'Charles';
  const VALID_LASTNAME2 = 'Babbage';

  const ADA = {
    title: TITLES.MISS.type,
    firstName: VALID_FIRSTNAME1,
    lastName: VALID_LASTNAME1,
  };
  const BABBAGE = {
    title: TITLES.MISTER.type,
    firstName: VALID_FIRSTNAME2,
    lastName: VALID_LASTNAME2,
  };

  const onePersonvalidPersons = [
    {
      privileged: true,
      ...ADA,
    },
  ];
  const validPrivilegedFirstPersons = [
    {
      privileged: true,
      ...ADA,
    },
    {
      privileged: false,
      ...BABBAGE,
    },
  ];
  const validPrivilegedSecondPersons = [
    {
      privileged: false,
      ...ADA,
    },
    {
      privileged: true,
      ...BABBAGE,
    },
  ];

  // addresses
  const VALID_POSTCODE = '123456';
  const VALID_CITYNAME = 'Champagnole';
  const VALID_ADDRESS_INPUT = `${VALID_POSTCODE} ${VALID_CITYNAME}`;
  const validAddress = { l6: VALID_ADDRESS_INPUT };
  const richValidAddress = { ...validAddress, elevator: true, cityPriorityDistrict: false };

  const minimalValidSurveyUnit = {
    persons: onePersonvalidPersons,
    address: validAddress,
  };
  const firstPersonValidSurveyUnit = {
    persons: validPrivilegedFirstPersons,
    address: validAddress,
  };
  const secondPersonValidSurveyUnit = {
    persons: validPrivilegedSecondPersons,
    address: validAddress,
  };

  const richAddressValidSurveyUnit = {
    persons: onePersonvalidPersons,
    address: richValidAddress,
  };

  it('accepts single person and the simplest address', () => {
    expect(getRecipientInformation(minimalValidSurveyUnit)).toEqual(
      generateExpectedOutput(ADA, VALID_CITYNAME, VALID_POSTCODE)
    );
  });
  it('accepts two persons with first person as privileged and the simplest address', () => {
    expect(getRecipientInformation(firstPersonValidSurveyUnit)).toEqual(
      generateExpectedOutput(ADA, VALID_CITYNAME, VALID_POSTCODE)
    );
  });
  it('accepts two persons with second person as privileged and the simplest address', () => {
    expect(getRecipientInformation(secondPersonValidSurveyUnit)).toEqual(
      generateExpectedOutput(BABBAGE, VALID_CITYNAME, VALID_POSTCODE)
    );
  });

  it('accepts single person and complexe address', () => {
    expect(getRecipientInformation(richAddressValidSurveyUnit)).toEqual(
      generateExpectedOutput(ADA, VALID_CITYNAME, VALID_POSTCODE)
    );
  });
  const generateExpectedOutput = (person, cityName, postCode) => ({
    title: person.title,
    recipientFirstName: person.firstName,
    recipientLastName: person.lastName,
    recipientCityName: cityName,
    recipientPostcode: postCode,
    address: [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
  });
});
