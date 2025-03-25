import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

['/'].forEach(url => {
  test(`Should check accessibilituy for url ${url}`, async ({ page }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
