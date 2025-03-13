import { expect, Page } from '@playwright/test';
import { GenericPage } from './generic-page.po';

const totalSu = 18;

export class HomePage implements GenericPage {
  constructor(private readonly page: Page) {}

  go() {
    return this.page.goto('/', { timeout: 10000 });
  }

  async importData() {
    await this.page.getByLabel('DevTools').hover();
    await this.page.getByRole('button', { name: 'Importer des données de test' }).click();
    await this.page.getByText('Mon suivi').hover();
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
