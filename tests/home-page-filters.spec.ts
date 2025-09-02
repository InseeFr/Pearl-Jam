import { expect, test } from '@playwright/test';
import { HomePage } from './page-object/home.po';

test('check if filters are saved inside the localStorage', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.synchronize();

  await homePage.checkNumberOfDisplayedItems(14);
  await page.getByLabel('A préparer').check();
  await page.getByLabel('vqs2021x00').check();
  await homePage.checkNumberOfDisplayedItems(3);

  await page.reload();

  await homePage.checkNumberOfDisplayedItems(3);

  await page.getByRole('checkbox', { name: 'A préparer', checked: true }).uncheck();
  await page.getByRole('checkbox', { name: 'vqs2021x00', checked: true }).uncheck();

  await homePage.checkNumberOfDisplayedItems(14);
});

test('check if the status filters is working properly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.synchronize();

  await page.getByLabel('A préparer').check();

  await homePage.checkNumberOfDisplayedItems(3);

  await homePage.resetAllFilters();

  await page.getByLabel('A repérer/Contacter').check();

  await homePage.checkNumberOfDisplayedItems(3);

  await homePage.resetAllFilters();

  await page.getByLabel('A enquêter').check();

  await homePage.checkNumberOfDisplayedItems(0);

  await homePage.resetAllFilters();

  await page.getByLabel('A finaliser').check();

  await homePage.checkNumberOfDisplayedItems(8);

  await homePage.resetAllFilters();

  await page.getByLabel('A transmettre').check();

  await homePage.checkNumberOfDisplayedItems(0);

  await homePage.resetAllFilters();

  await page.getByLabel('A synchroniser').check();

  await homePage.checkNumberOfDisplayedItems(0);

  await homePage.resetAllFilters();

  await page.getByLabel('Terminé', { exact: true }).check();

  await homePage.checkNumberOfDisplayedItems(0);

  await homePage.resetAllFilters();
});

test('check if the priority filter is working properly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.synchronize();
  await homePage.checkNumberOfDisplayedItems(14);
  await page.getByLabel('Unités prioritaires').check();
  await homePage.checkNumberOfDisplayedItems(3);
  await homePage.resetAllFilters();
});

test('check if the Survey filter is working properly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.synchronize();
  await homePage.checkNumberOfDisplayedItems(14);
  await page.getByLabel('vqs2021x00').check();
  await homePage.checkNumberOfDisplayedItems(3);
  await homePage.resetAllFilters();
  await homePage.checkNumberOfDisplayedItems(14);
  await page.getByLabel('aqv2023x00', { exact: true }).check();
  await homePage.checkNumberOfDisplayedItems(5);
  await homePage.resetAllFilters();
});

test('check if the cluster filter is working properly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.synchronize();
  await page.getByRole('combobox').first().click();
  await page.getByRole('option', { name: '1' }).click();
  await homePage.checkNumberOfDisplayedItems(11);
  await page.getByRole('combobox').nth(1).click();
  await page.getByRole('option', { name: '15' }).click();
  await homePage.checkNumberOfDisplayedItems(1);
});

test('check if the reset feature is working properly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.synchronize();

  await page.getByLabel('A préparer').check();
  await page.getByLabel('vqs2021x00').check();

  const filter1 = await page.getByLabel('A préparer');
  const filter2 = await page.getByLabel('vqs2021x00');

  expect(filter1).toBeChecked();
  expect(filter2).toBeChecked();

  await homePage.checkNumberOfDisplayedItems(3);

  await homePage.resetAllFilters();

  expect(filter1).not.toBeChecked();
  expect(filter2).not.toBeChecked();
  await homePage.checkNumberOfDisplayedItems(14);
});

test('check if the search input is working properly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.synchronize();
  await page.getByPlaceholder('Nom, prénom, ville, enquête,').fill('lamoth');
  await homePage.checkNumberOfDisplayedItems(1);
});

test('check if the order input is working properly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.synchronize();
  await page.getByLabel('Trier par :').click();
  await page.getByRole('option', { name: 'Priorité' }).click();
  await page.getByLabel('delete').click();
  const first = await page.$('.MuiCardContent-root');
  expect(await first?.innerText()).toContain('MOREAU Isabelle');
});
