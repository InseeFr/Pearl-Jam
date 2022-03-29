import { db } from 'utils/indexeddb/idb-config';
import { useLiveQuery } from 'dexie-react-hooks';

// prevent liveQuery from triggering on comments changes
export const useSurveyUnit = id => useLiveQuery(async () => await db.surveyUnit.get(id));

export const useSurveyUnits = () => useLiveQuery(() => db.surveyUnit.toArray(), [], []);

export const useMissingSurveyUnits = () =>
  useLiveQuery(() => db.surveyUnitMissing.toArray(), [], []);
