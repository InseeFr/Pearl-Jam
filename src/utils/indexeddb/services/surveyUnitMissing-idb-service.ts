import { type SurveyUnitMissing } from '../idb-config';
import AbstractIdbService from './abstract-idb-service';

class SurveyUnitMissingIdbService extends AbstractIdbService<SurveyUnitMissing> {
  constructor() {
    super('surveyUnitMissing');
  }
}

export default new SurveyUnitMissingIdbService();
