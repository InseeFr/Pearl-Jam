import AbstractIdbService from './abstract-idb-service';
import { type SurveyUnit } from '../idb-config';
class SurveyUnitIdbService extends AbstractIdbService<SurveyUnit> {
  constructor() {
    super('surveyUnit');
  }

  /**
   * Update or insert a surveyUnit if the ID is unknown
   */
  async addOrUpdateSU(item: SurveyUnit) {
    const { id, ...other } = item;
    const surveyUnit = await this.getById(id);
    /* prevent duplicated survey-unit */
    if (surveyUnit) {
      return this.update(item);
    }
    return this.insert({ id: `${id}`, ...other });
  }
}

export const surveyUnitIDBService = new SurveyUnitIdbService();
