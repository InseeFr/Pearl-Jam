import AbstractIdbService from './abstract-idb-service';

class NotificationIdbService extends AbstractIdbService {
  constructor() {
    super('notification');
  }

  async addOrUpdateNotif(item) {
    const { id, ...other } = item;
    const notification = await this.getById(id);
    /* prevent duplicated survey-unit */
    if (notification) {
      return this.update(item);
    }
    return this.insert({ id: `${id}`, ...other });
  }
}

export default new NotificationIdbService();
