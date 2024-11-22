import AbstractIdbService from './abstract-idb-service';
import { type SyncReport } from '../idb-config';

class SyncReportIdbService extends AbstractIdbService<SyncReport> {
  constructor() {
    super('syncReport');
  }

  async addOrUpdateReport(item: SyncReport) {
    const { id, ...other } = item;
    const report = await this.getById(id);
    if (report) {
      return this.update(item);
    }
    return this.insert({ id: `${id}`, ...other });
  }
}

export default new SyncReportIdbService();
