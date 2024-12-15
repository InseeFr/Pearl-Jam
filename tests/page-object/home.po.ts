import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  go() {
    return this.page.goto('/');
  }

  importData() {
    return this.page.getByRole('button', { name: 'Importer des données de test' }).click();
  }
}
