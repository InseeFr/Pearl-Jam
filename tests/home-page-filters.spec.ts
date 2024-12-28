import { expect, test } from '@playwright/test';
import { HomePage } from './page-object/home.po';

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.importData();
});

test('check if filters are saved inside the localStorage', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.checkNumberOfDisplayedItems(13, 13);
  await page.getByLabel('A préparer').check();
  await page.getByLabel('secondtestcampaign').check();
  await homePage.checkNumberOfDisplayedItems(1, 13);

  await page.reload();

  const filter1 = await page.getByLabel('A préparer');
  const filter2 = await page.getByLabel('secondtestcampaign');

  expect(filter1).toBeChecked();
  expect(filter2).toBeChecked();
  await homePage.checkNumberOfDisplayedItems(1, 13);
});

test('check if the status filters is working properly', async ({ page }) => {
  const homePage = new HomePage(page);

  await page.getByLabel('A préparer').check();

  await homePage.checkNumberOfDisplayedItems(1, 13);

  await homePage.resetAllFilters();

  await page.getByLabel('A repérer/Contacter').check();

  await homePage.checkNumberOfDisplayedItems(6, 13);

  await homePage.resetAllFilters();

  await page.getByLabel('A enquêter').check();

  await homePage.checkNumberOfDisplayedItems(6, 13);

  await homePage.resetAllFilters();

  await page.getByLabel('A finaliser').check();

  await homePage.checkNumberOfDisplayedItems(0, 13);

  await homePage.resetAllFilters();

  await page.getByLabel('A transmettre').check();

  await homePage.checkNumberOfDisplayedItems(0, 13);

  await homePage.resetAllFilters();

  await page.getByLabel('A synchroniser').check();

  await homePage.checkNumberOfDisplayedItems(0, 13);

  await homePage.resetAllFilters();

  await page.getByLabel('Terminé', { exact: true }).check();

  await homePage.checkNumberOfDisplayedItems(0, 13);

  await homePage.resetAllFilters();
});

test('check if the priority filter is working properly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.checkNumberOfDisplayedItems(13, 13);
  await page.getByLabel('Unités prioritaires').check();
  await homePage.checkNumberOfDisplayedItems(5, 13);
  await homePage.resetAllFilters();
});

test('check if the Survey filter is working properly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.checkNumberOfDisplayedItems(13, 13);
  await page.getByLabel('secondtestcampaign').check();
  await homePage.checkNumberOfDisplayedItems(8, 13);
  await homePage.resetAllFilters();
  await page.getByLabel('testcampaign', { exact: true }).check();
  await homePage.checkNumberOfDisplayedItems(5, 13);
  await homePage.resetAllFilters();
});

test('check if the cluster filter is working properly', () => {});

test('check if the reset feature is working properly', async ({ page }) => {
  const homePage = new HomePage(page);

  await page.getByLabel('A préparer').check();
  await page.getByLabel('secondtestcampaign').check();

  const filter1 = await page.getByLabel('A préparer');
  const filter2 = await page.getByLabel('secondtestcampaign');

  expect(filter1).toBeChecked();
  expect(filter2).toBeChecked();

  await homePage.checkNumberOfDisplayedItems(1, 13);

  await homePage.resetAllFilters();

  expect(filter1).not.toBeChecked();
  expect(filter2).not.toBeChecked();
  await homePage.checkNumberOfDisplayedItems(13, 13);
});

test('check if the search input is working properly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.checkNumberOfDisplayedItems(13, 13);
  await page.getByPlaceholder('Nom, prénom, ville, enquête,').fill('graham');
  await homePage.checkNumberOfDisplayedItems(4, 13);
});

test('check if the order input is working properly', () => {});
