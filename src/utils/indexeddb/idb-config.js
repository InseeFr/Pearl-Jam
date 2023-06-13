import Dexie from 'dexie';
import schema from './schema.json';
import schema2 from './schema-2.json';
import schema3 from './schema-3.json';
import schema4 from './schema-4.json';

export const db = new Dexie('Pearl');

db.version(1).stores(schema);
// upgrade dataBase (please see https://dexie.org/docs/Tutorial/Design#database-versioning)
db.version(2)
  .stores(schema2)
  .upgrade(tx => {
    // An upgrade function for version 2 will upgrade data based on version 1.
    // delete unused attribute
    return tx
      .table('notification')
      .toCollection()
      .modify(notif => {
        // Modify each friend:
        delete notif.time;
        delete notif.message;
      });
  });
db.version(3).stores(schema3);
db.version(4).stores(schema4);
