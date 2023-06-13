import AbstractIdbService from './abstract-idb-service';

class UserIdbService extends AbstractIdbService {
  constructor() {
    super('user');
  }
}

export default new UserIdbService();
