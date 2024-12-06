import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  go() {
    this.page.goto('/');
  }

  importData() {
    this.page.getByRole('button', { name: 'Importer des données de test' }).click();
  }
}
