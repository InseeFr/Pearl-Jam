import { type SyncResult } from '../../../types/pearl';

export type SyncReport = {
  id: string;
  transmittedSurveyUnits: SyncResult['details']['transmittedSurveyUnits'];
  loadedSurveyUnits: SyncResult['details']['loadedSurveyUnits'];
};
