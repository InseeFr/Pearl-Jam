import AbstractIdbService from './abstract-idb-service';

class SurveyUnitMissingIdbService extends AbstractIdbService {
  constructor() {
    super('surveyUnitMissing');
  }
}

export default new SurveyUnitMissingIdbService();
