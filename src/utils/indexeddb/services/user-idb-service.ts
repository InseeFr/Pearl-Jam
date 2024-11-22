import AbstractIdbService from './abstract-idb-service';
import { type User } from '../idb-config';

class UserIdbService extends AbstractIdbService<User> {
  constructor() {
    super('user');
  }
}

export default new UserIdbService();
