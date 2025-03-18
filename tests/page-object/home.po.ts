import { expect, Page } from '@playwright/test';
import { GenericPage } from './generic-page.po';

export const totalSu = 25;

export class HomePage implements GenericPage {
  constructor(private readonly page: Page) {}

  async go() {
    await this.page.goto('/', { timeout: 10000 });
    await this.page.getByRole('textbox', { name: 'Username or email' }).click();
    await this.page.getByRole('textbox', { name: 'Username or email' }).fill('interv5');
    await this.page.getByRole('textbox', { name: 'Username or email' }).press('Tab');
    await this.page.getByRole('textbox', { name: 'Password' }).fill('interv5');
    await this.page.getByRole('button', { name: 'Sign In' }).click();
    await this.page.getByRole('button', { name: 'Fermer' }).click();
  }

  async importData() {
    await this.page.getByRole('button', { name: 'Synchroniser' }).click();
    await this.page.getByRole('button', { name: "J'ai compris" }).click();
  }

  async checkNumberOfDisplayedItems(count: number) {
    await expect(
      this.page.getByText(`${count} unités sur ${totalSu}`, { exact: false })
    ).toBeVisible();
  }

  resetAllFilters() {
    return this.page.getByRole('button', { name: 'Réinitialiser les filtres' }).click();
  }
}
