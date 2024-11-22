import AbstractIdbService from './abstract-idb-service';
import { type Notification } from '../idb-config';

class NotificationIdbService extends AbstractIdbService<Notification> {
  constructor() {
    super('notification');
  }

  async addOrUpdateNotif(item: Notification) {
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
