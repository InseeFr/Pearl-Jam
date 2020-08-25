import D from 'i18n';

const contactAttempt = {
  CONTACT_MADE: { type: 'COM', value: `${D.contactMade}` },
  NUMBER_NOT_IN_USE: { type: 'NIN', value: `${D.numberNotInUse}` },
  NO_CONTACT: { type: 'NOC', value: `${D.noContact}` },
  BUSY_LINE: { type: 'BUL', value: `${D.busyLine}` },
  ANSWERING_MACHINE: { type: 'ANM', value: `${D.answeringMachine}` },
};

export default contactAttempt;

export const findContactAttemptValueByType = type => {
  const retour = Object.keys(contactAttempt)
    .map(key => contactAttempt[key])
    .filter(value => value.type === type);
  return retour[0].value;
};
