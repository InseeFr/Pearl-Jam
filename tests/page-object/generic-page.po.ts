import { Response } from '@playwright/test';

export interface GenericPage {
  go: () => Promise<Response | null>;
}
