import { db } from 'utils/indexeddb/idb-config';
import { useLiveQuery } from 'dexie-react-hooks';

export const useSurveyUnit = (id: string) =>
  useLiveQuery(async () => (await db.surveyUnit.get(id)) ?? undefined);

export const useSurveyUnits = () => useLiveQuery(() => db.surveyUnit.toArray(), [], []);

export const useMissingSurveyUnits = () =>
  useLiveQuery(() => db.surveyUnitMissing.toArray(), [], []);
