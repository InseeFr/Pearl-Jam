import { db } from 'utils/indexeddb/idb-config';
import { useLiveQuery } from 'dexie-react-hooks';

export const useSurveyUnit = id => useLiveQuery(async () => await db.surveyUnit.get(id));

/**
 * @typedef {import("@src/pearl.type.ts").SurveyUnit} SurveyUnit
 */

/**
 * @type {() => SurveyUnit[]}
 */
export const useSurveyUnits = () => useLiveQuery(() => db.surveyUnit.toArray(), [], []);

export const useMissingSurveyUnits = () =>
  useLiveQuery(() => db.surveyUnitMissing.toArray(), [], []);

export const getUser = () => db.user.limit(1);
