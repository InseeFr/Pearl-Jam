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

test('check if the status filters is working properly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.importData();

  await page.getByLabel('A préparer').check();

  await homePage.checkNumberOfDisplayedItems(1);

  await homePage.resetAllFilters();

  await page.getByLabel('A repérer/Contacter').check();

  await homePage.checkNumberOfDisplayedItems(10);

  await homePage.resetAllFilters();

  await page.getByLabel('A enquêter').check();

  await homePage.checkNumberOfDisplayedItems(6);

  await homePage.resetAllFilters();

  await page.getByLabel('A finaliser').check();

  await homePage.checkNumberOfDisplayedItems(0);

  await homePage.resetAllFilters();

  await page.getByLabel('A transmettre').check();

  await homePage.checkNumberOfDisplayedItems(1);

  await homePage.resetAllFilters();

  await page.getByLabel('A synchroniser').check();

<<<<<<< HEAD
  await homePage.checkNumberOfDisplayedItems(0);
=======
  await homePage.checkNumberOfDisplayedItems(0, 25);
>>>>>>> 30f23e1 (playwright with docker)

  await homePage.resetAllFilters();

  await page.getByLabel('Terminé', { exact: true }).check();

<<<<<<< HEAD
  await homePage.checkNumberOfDisplayedItems(0);
=======
  await homePage.checkNumberOfDisplayedItems(0, 25);
>>>>>>> 30f23e1 (playwright with docker)

  await homePage.resetAllFilters();
});

test('check if the priority filter is working properly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.importData();
<<<<<<< HEAD
  await homePage.checkNumberOfDisplayedItems(totalSu);
  await page.getByLabel('Unités prioritaires').check();
  await homePage.checkNumberOfDisplayedItems(5);
=======
  await homePage.checkNumberOfDisplayedItems(14, 25);
  await page.getByLabel('Unités prioritaires').check();
  await homePage.checkNumberOfDisplayedItems(3, 25);
>>>>>>> 30f23e1 (playwright with docker)
  await homePage.resetAllFilters();
});

test('check if the Survey filter is working properly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.importData();
<<<<<<< HEAD
  await homePage.checkNumberOfDisplayedItems(totalSu);
  await page.getByLabel('secondtestcampaign').check();
  await homePage.checkNumberOfDisplayedItems(13);
  await homePage.resetAllFilters();
  await homePage.checkNumberOfDisplayedItems(totalSu);
  await page.getByLabel('testcampaign', { exact: true }).check();
  await homePage.checkNumberOfDisplayedItems(5);
=======
  await homePage.checkNumberOfDisplayedItems(14, 25);
  await page.getByLabel('vqs2021x00').check();
  await homePage.checkNumberOfDisplayedItems(3, 25);
  await homePage.resetAllFilters();
  await homePage.checkNumberOfDisplayedItems(14, 25);
  await page.getByLabel('aqv2023x00', { exact: true }).check();
  await homePage.checkNumberOfDisplayedItems(5, 25);
>>>>>>> 30f23e1 (playwright with docker)
  await homePage.resetAllFilters();
});

test('check if the cluster filter is working properly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.importData();
  await page.getByRole('combobox').first().click();
<<<<<<< HEAD
  await page.getByRole('option', { name: '2' }).click();
  await homePage.checkNumberOfDisplayedItems(13);
  await page.getByRole('combobox').nth(1).click();
  await page.getByRole('option', { name: '1' }).click();
  await page.getByText(`unités sur ${totalSu}`).click();
  await homePage.checkNumberOfDisplayedItems(0);
=======
  await page.getByRole('option', { name: '1' }).click();
  await homePage.checkNumberOfDisplayedItems(11, 25);
  await page.getByRole('combobox').nth(1).click();
  await page.getByRole('option', { name: '15' }).click();
  await homePage.checkNumberOfDisplayedItems(1, 25);
>>>>>>> 30f23e1 (playwright with docker)
});

test('check if the reset feature is working properly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.importData();

  await page.getByLabel('A préparer').check();
  await page.getByLabel('vqs2021x00').check();

  const filter1 = await page.getByLabel('A préparer');
  const filter2 = await page.getByLabel('vqs2021x00');

  expect(filter1).toBeChecked();
  expect(filter2).toBeChecked();

<<<<<<< HEAD
  await homePage.checkNumberOfDisplayedItems(1);
=======
  await homePage.checkNumberOfDisplayedItems(3, 25);
>>>>>>> 30f23e1 (playwright with docker)

  await homePage.resetAllFilters();

  expect(filter1).not.toBeChecked();
  expect(filter2).not.toBeChecked();
<<<<<<< HEAD
  await homePage.checkNumberOfDisplayedItems(totalSu);
=======
  await homePage.checkNumberOfDisplayedItems(14, 25);
>>>>>>> 30f23e1 (playwright with docker)
});

test('check if the search input is working properly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.importData();
<<<<<<< HEAD
  await page.getByPlaceholder('Nom, prénom, ville, enquête,').fill('graham');
  await homePage.checkNumberOfDisplayedItems(9);
=======
  await page.getByPlaceholder('Nom, prénom, ville, enquête,').fill('lamoth');
  await homePage.checkNumberOfDisplayedItems(1, 25);
>>>>>>> 30f23e1 (playwright with docker)
});

test('check if the order input is working properly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.importData();
  await page.getByLabel('Trier par :').click();
  await page.getByRole('option', { name: 'Priorité' }).click();
  await page.getByLabel('delete').click();
  const first = await page.$('.MuiCardContent-root');
  expect(await first?.innerText()).toContain('MOREAU Isabelle');
});
