import { Page } from '@playwright/test';

export class SurveyPage {
  constructor(private readonly page: Page) {}

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

  async addContactAttempt() {
    await this.page.getByRole('button', { name: 'Ajouter un essai' }).click();
    await this.page.getByText('Face à face', { exact: true }).click();
    await this.page.getByRole('button', { name: 'Confirmer' }).click();

    await this.page.getByLabel('Choisir le type de contact').getByText('Enquête acceptée').click();
    await this.page.getByRole('button', { name: 'Confirmer' }).click();
    await this.page.getByRole('button', { name: 'Confirmer' }).click();
  }

  async editContactOutcome() {
    await this.page.getByRole('button', { name: 'Modifier le bilan des contacts' }).click();
    await this.page.getByText('Indisponibilité définitive').click();
    await this.page.getByRole('button', { name: 'Enregistrer' }).click();
  }

  async forward() {
    await this.page
      .locator('div')
      .filter({ hasText: /^Finalisé$/ })
      .getByRole('button')
      .click();
  }
}
