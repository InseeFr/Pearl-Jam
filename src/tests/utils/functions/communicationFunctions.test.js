import { TITLES } from 'utils/constants';
import { getRecipientInformation, isEmailValid, isValidTitle } from 'utils/functions';

describe('isValidTitle', () => {
  const MISTER = 'MISTER';
  const mister = 'mister';
  const MISS = 'MISS';
  const miss = 'miss';
  const mylady = 'mylady';

  it('should return true if value is in TITLES enum', () => {
    expect(isValidTitle(mister)).toBeTruthy();
    expect(isValidTitle(MISTER)).toBeTruthy();
    expect(isValidTitle(miss)).toBeTruthy();
    expect(isValidTitle(MISS)).toBeTruthy();
  });
  it('should return false if value not in TITLES enum', () => {
    expect(isValidTitle(mylady)).toBeFalsy();
  });
});

describe('isvalidEmail', () => {
  const noAtEmail = 'in.validee.ma.il';
  const tooShortDomainExtensionEmail = 'too.short@email.x';
  const tooLongDomainExtensionEmail = 'too.long@email.extension';
  const missingPreAt = '@missingPreAt.ma.il';
  const missingPostAt = 'missing.postAt@';

  const validEmailAdress = 'valid.email@addr.ess';
  const anotherValidEmailAdress = 'anothervalidemail@addr.ess';
  const yetAnotherValidEmailAdress = 'yetAnothervalidemail@add.re.ss';
  it('should return false if pattern is not respected', () => {
    expect(isEmailValid(noAtEmail)).toBeFalsy();
    expect(isEmailValid(tooShortDomainExtensionEmail)).toBeFalsy();
    expect(isEmailValid(tooLongDomainExtensionEmail)).toBeFalsy();
    expect(isEmailValid(missingPreAt)).toBeFalsy();
    expect(isEmailValid(missingPostAt)).toBeFalsy();
  });
  it('should return true if pattern is respected', () => {
    expect(isEmailValid(validEmailAdress)).toBeTruthy();
    expect(isEmailValid(anotherValidEmailAdress)).toBeTruthy();
    expect(isEmailValid(yetAnotherValidEmailAdress)).toBeTruthy();
  });
});

describe('getRecipientInformation', () => {
  const MISSING = undefined;
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

  const badInput = { iam: 'bad' };

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
    address: ['', '', '', '', '', '', '', ''],
  });
});
