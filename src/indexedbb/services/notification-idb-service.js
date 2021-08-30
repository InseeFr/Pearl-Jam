import AbstractIdbService from './abstract-idb-service';

class NotificationIdbService extends AbstractIdbService {
  constructor() {
    super('notification');
  }

  async addOrUpdateNotif(item) {
    const { id } = item;
    /* prevent duplicated survey-unit */
    if (id) {
      const notification = await this.get(id);
      if (notification) {
        return this.update(item);
      }
    }
    return this.insert(item);
  }
}

export default new NotificationIdbService();
