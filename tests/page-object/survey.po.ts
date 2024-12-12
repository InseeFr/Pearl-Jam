import { Page } from '@playwright/test';

export class SurveyPage {
  constructor(private page: Page) {}

  selectSurvey() {
    return this.page
      .locator('div')
      .filter({ hasText: /^GRAHAM-2 Leanne-2#questNotAvailable$/ })
      .getByRole('link')
      .click();
  }

  getTitle(title: string) {
    return this.page.getByRole('heading', { name: title });
  }

  selectTab(title: string) {
    return this.page.getByRole('tab', { name: title }).click();
  }
}
