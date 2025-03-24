import { expect, test } from '@playwright/test';
import { HomePage, totalSu } from './page-object/home.po';

test('check if filters are saved inside the localStorage', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.importData();

  await homePage.checkNumberOfDisplayedItems(totalSu);
  await page.getByLabel('A préparer').check();
  await page.getByLabel('secondtestcampaign').check();
  await homePage.checkNumberOfDisplayedItems(1);

  await page.reload();

  await homePage.checkNumberOfDisplayedItems(1);

  await page.getByRole('checkbox', { name: 'A préparer', checked: true }).uncheck();
  await page.getByRole('checkbox', { name: 'vqs2021x00', checked: true }).uncheck();

  await homePage.checkNumberOfDisplayedItems(totalSu);
});
