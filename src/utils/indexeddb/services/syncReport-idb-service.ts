import AbstractIdbService from './abstract-idb-service';
import { type SyncReport } from '../idb-config';

class SyncReportIdbService extends AbstractIdbService<SyncReport> {
  constructor() {
    super('syncReport');
  }

  async addOrUpdateReport(item: Partial<SyncReport>) {
    const { id, ...other } = item;
    const report = await this.getById(id!);
    if (report) {
      return this.update(item as SyncReport);
    }
    return this.insert({ id: `${id}`, ...other } as SyncReport);
  }
}

export default new SyncReportIdbService();
