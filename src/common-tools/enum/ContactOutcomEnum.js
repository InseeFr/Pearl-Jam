import D from 'i18n';

const contactOutcome = {
  INTERVIEW_ACCEPTED: { type: 'INA', value: `${D.interviewAccepted}` },
  IMPOSSIBLE_TO_REACH: { type: 'IMP', value: `${D.impossibleReach}` },
  REFUSAL: { type: 'REF', value: `${D.refusal}` },
  INTERVIEW_IMPOSSIBLE: { type: 'INI', value: `${D.interviewImpossible}` },
  ALREADY_ANSWERED: { type: 'ALA', value: `${D.alreadyAnsweredAnotherMode}` },
  WISH_ANOTHER_MODE: { type: 'WAM', value: `${D.wishAnswerAnotherMode}` },
  OUT_OF_SCOPE: { type: 'OOS', value: `${D.outOfScope}` },
};

export default contactOutcome;

export const findContactOutcomeValueByType = type => {
  if (type === undefined) return undefined;
  const retour = Object.keys(contactOutcome)
    .map(key => contactOutcome[key])
    .filter(value => value.type === type);
  return retour[0].value;
};
