import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

['/'].forEach(url => {
  test(`Should check accessibilituy for url ${url}`, async ({ page }) => {
    await page.goto('/');

    await page.getByRole('textbox', { name: 'Username or email' }).click();
    await page.getByRole('textbox', { name: 'Username or email' }).fill('interv5');
    await page.getByRole('textbox', { name: 'Username or email' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('interv5');
    await page.getByRole('button', { name: 'Sign In' }).click();
    expect(page.getByRole('link', { name: 'Sabiane Collecte' })).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
