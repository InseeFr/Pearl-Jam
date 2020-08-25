import D from 'i18n';

const contactOutcome = {
  INTERVIEW_ACCEPTED: { type: 'INA', value: `${D.interviewAccepted}` },
  REFUSAL: { type: 'REF', value: `${D.refusal}` },
  INTERVIEW_IMPOSSIBLE: { type: 'INI', value: `${D.interviewImpossible}` },
  ALREADY_ANSWERED: { type: 'ALA', value: `${D.alreadyAnswered}` },
  OUT_OF_SCOPE: { type: 'OOS', value: `${D.outOfScope}` },
};

export default contactOutcome;

export const findContactOutcomeValueByType = type => {
  const retour = Object.keys(contactOutcome)
    .map(key => contactOutcome[key])
    .filter(value => value.type === type);
  return retour[0].value;
};
