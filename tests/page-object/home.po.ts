import { expect, Page } from '@playwright/test';
import { GenericPage } from './generic-page.po';

export class HomePage implements GenericPage {
  constructor(private readonly page: Page) {}

  go() {
    return this.page.goto('/');
  }

  importData() {
    return this.page.getByRole('button', { name: 'Importer des données de test' }).click();
  }

  async checkNumberOfDisplayedItems(count: number, total: number) {
    expect(
      await this.page.getByText(`${count} unités sur ${total}`, { exact: false })
    ).toBeVisible();
  }

  resetAllFilters() {
    return this.page.getByRole('button', { name: 'Réinitialiser les filtres' }).click();
  }
}
