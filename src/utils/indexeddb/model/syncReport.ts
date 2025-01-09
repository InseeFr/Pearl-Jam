import { type SyncResult } from '../../../types/pearl';

export type SyncReport = {
  id: string;
  transmittedSurveyUnits: Required<SyncResult>['details']['transmittedSurveyUnits'];
  loadedSurveyUnits: Required<SyncResult>['details']['loadedSurveyUnits'];
};
