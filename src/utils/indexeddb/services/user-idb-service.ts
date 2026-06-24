import { User } from '../model/user';
import AbstractIdbService from './abstract-idb-service';

class UserIdbService extends AbstractIdbService<User> {
  constructor() {
    super('user');
  }
}

export default new UserIdbService();
