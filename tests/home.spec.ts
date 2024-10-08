import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.route('/configuration.json', async router =>
    router.fulfill({
      json: {
        PEARL_AUTHENTICATION_MODE: 'anonymous',
      },
    })
  );
  await page.goto('/');

  await expect(page).toHaveTitle(/Collecte Enquêteurs/);
  await expect(page.getByRole('link', { name: 'Sabiane Collecte' })).toBeVisible();
});
