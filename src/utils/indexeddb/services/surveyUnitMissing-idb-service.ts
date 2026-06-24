import { SurveyUnitMissing } from '../model/surveyUnitMissing';
import AbstractIdbService from './abstract-idb-service';

class SurveyUnitMissingIdbService extends AbstractIdbService<SurveyUnitMissing> {
  constructor() {
    super('surveyUnitMissing');
  }
}

export default new SurveyUnitMissingIdbService();
