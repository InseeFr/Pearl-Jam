import Dexie, { type EntityTable } from 'dexie';
import schema from './schema.json';
import schema2 from './schema-2.json';
import schema3 from './schema-3.json';
import schema4 from './schema-4.json';
import schema5 from './schema-5.json';
import schema6 from './schema-6.json';
import { User } from './model/user';
import { SyncReport } from './model/syncReport';
import { SurveyUnitMissing } from './model/surveyUnitMissing';
import type { Notification, LocalSurveyUnit } from '../../types/pearl';
import {
  contactOutcomes,
  deprecatedContactOutcomes,
} from 'utils/functions/contacts/ContactOutcome';

export const db = new Dexie('Pearl') as Dexie & {
  notification: EntityTable<Notification, 'id'>;
  user: EntityTable<User, 'id'>;
  syncReport: EntityTable<SyncReport, 'id'>;
  surveyUnitMissing: EntityTable<SurveyUnitMissing, 'id'>;
  surveyUnit: EntityTable<LocalSurveyUnit, 'id'>;
};

const convertDeprecatedContactOutcomeType = (contactOutcomeType: string) => {
  let newContactOutcomeType = contactOutcomeType;
  if (contactOutcomeType === deprecatedContactOutcomes.DECEASED.value)
    newContactOutcomeType = contactOutcomes.NOT_APPLICABLE.value;
  else if (
    contactOutcomeType === deprecatedContactOutcomes.DEFINITLY_UNAVAILABLE_FOR_UNKNOWN_REASON.value
  ) {
    newContactOutcomeType = contactOutcomes.DEFINITLY_UNAVAILABLE.value;
  }

  return newContactOutcomeType;
};

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
// drop user table to allow primary key change, data loss is trivial
db.version(5).stores({ user: null });
db.version(6).stores(schema5);
db.version(7)
  .stores(schema5)
  .upgrade(tx => {
    return tx
      .table('surveyUnit')
      .toCollection()
      .modify(su => {
        if (su.contactOutcome?.type)
          su.contactOutcome.type = convertDeprecatedContactOutcomeType(su.contactOutcome.type);
      });
  });

db.version(8)
  .stores(schema6)
  .upgrade(tx => {
    return tx
      .table('surveyUnit')
      .toCollection()
      .modify(su => {
        // Set hasBeenUpdated to true for all existing survey units
        // This ensures first synchronization after update will send all units
        su.hasBeenUpdated = true;
      });
  });
