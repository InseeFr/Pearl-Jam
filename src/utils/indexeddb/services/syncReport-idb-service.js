import AbstractIdbService from './abstract-idb-service';

class SyncReportIdbService extends AbstractIdbService {
  constructor() {
    super('syncReport');
  }

  async addOrUpdateReport(item) {
    const { id, ...other } = item;
    const report = await this.getById(id);
    if (report) {
      return this.update(item);
    }
    return this.insert({ id: `${id}`, ...other });
  }
}

export default new SyncReportIdbService();
