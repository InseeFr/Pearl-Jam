import { test, expect } from '@playwright/test';

// Page Object Pattern
const IndexPage = {
  importData(page) {
    page.getByRole('button', { name: 'Importer des données de test' }).click();
  },
};

test('has title', async ({ page }) => {
  await page.goto('/');
  await IndexPage.importData(page);
  await page
    .locator('div')
    .filter({ hasText: /^GRAHAM-2 Leanne-2#questNotAvailable$/ })
    .getByRole('link')
    .click();
  await expect(page.locator('#root')).toContainText('GRAHAM-2 Leanne-2#questNotAvailable');
});
