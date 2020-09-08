import surveyUnitDBService from 'indexedbb/services/surveyUnit-idb-service';
import contactAttemptDBService from 'indexedbb/services/contactAttempt-idb-service';

export const getCommentByType = (type, ue) => {
  if (Array.isArray(ue.comments) && ue.comments.length > 0) {
    return ue.comments.find(x => x.type === type).value;
  }
  return '';
};

export const getLastState = ue => {
  if (Array.isArray(ue.states) && ue.states.length > 0) {
    return ue.states.reduce((a, b) => (a.date > b.date ? a : b));
  }
  return false;
};

export const isValidForTransmission = ue => {
  // TODO insert rules here (i.e contacts)
  return true;
};

export const deleteContactAttempt = (surveyUnit, contactAttemptId) => {
  const newSu = surveyUnit;
  const { contactAttempts } = newSu;
  const newCA = contactAttempts.filter(ca => ca !== contactAttemptId);
  newSu.contactAttempts = newCA;
  surveyUnitDBService.update(newSu);
  contactAttemptDBService.delete(contactAttemptId);
};

export const addNewState = async (surveyUnit, stateType) => {
  const newState = { date: new Date().getTime(), type: stateType };
  const newSu = surveyUnit;
  newSu.states.push(newState);
  newSu.lastState = newState;
  newSu.selected = false;
  await surveyUnitDBService.addOrUpdate(newSu);
};
