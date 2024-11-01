import AbstractIdbService from './abstract-idb-service';

class SurveyUnitIdbService extends AbstractIdbService {
  constructor() {
    super('surveyUnit');
  }

  /**
   * Update or insert a surveyUnit if the ID is unknown
   * @param {SurveyUnit} item
   * @returns {Promise<void>}
   */
  async addOrUpdateSU(item) {
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
