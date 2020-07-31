import AbstractIdbService from './abstract-idb-service';

class ContactAttemptIdbService extends AbstractIdbService {
  constructor() {
    super('synchroSummary');
  }

  async hideSummary() {
    const summaries = await this.getAll();
    const summary = await summaries[0];
    summary.hidden = true;
    this.update(summary);
  }
}

export default new ContactAttemptIdbService();
