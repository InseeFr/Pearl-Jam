import { type Table } from 'dexie';
import { db } from '../idb-config';

export type ID = string | number;

export default class AbstractIdbService<T extends { id: ID }> {
  private store;

  constructor(store: keyof typeof db) {
    this.store = db[store] as Table;
  }

  get(id: ID) {
    return this.store.get({ id: Number(id) });
  }

  getById(id: ID) {
    return this.store.get(id);
  }

  getAll() {
    return this.store.toArray();
  }

  getAllSortedBy(indexedVariable: string | string[]) {
    return this.store.orderBy(indexedVariable).toArray();
  }

  insert(item: T) {
    return this.store.add(item);
  }

  update(item: T) {
    return this.store.put(item);
  }

  delete(id: ID) {
    return this.store.delete(id);
  }

  deleteAll() {
    return this.store.clear();
  }

  async addOrUpdate(item: T) {
    if (item.id) {
      if ((await this.store.get(item.id)) === undefined) {
        return this.insert(item);
      }
      return this.update(item);
    }
    return 0;
  }

  addAll(items: T[]) {
    return this.store.bulkPut(items);
  }

  deleteByIds(ids: string[]) {
    return this.store.bulkDelete(ids);
  }
}
