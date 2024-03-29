import { db } from 'utils/indexeddb/idb-config';
import { useLiveQuery } from 'dexie-react-hooks';

export const useSurveyUnit = id => useLiveQuery(async () => await db.surveyUnit.get(id));

export const useSurveyUnits = () => useLiveQuery(() => db.surveyUnit.toArray(), [], []);

export const useMissingSurveyUnits = () =>
  useLiveQuery(() => db.surveyUnitMissing.toArray(), [], []);
