import { test, expect } from '@playwright/test';
import { HomePage } from './page-object/home.po';
import { SurveyPage } from './page-object/survey.po';

test('check if all tabs work properly', async ({ page }) => {
  const homePage = new HomePage(page);
  homePage.go();
  homePage.importData();

  const surveyPage = new SurveyPage(page);

  await surveyPage.selectSurvey();

  await expect(await surveyPage.getTitle('Logement')).toBeVisible();

  await surveyPage.selectTab('Contacts');
  await expect(await surveyPage.getTitle('Individu')).toBeVisible();

  await surveyPage.selectTab('Communications');
  await expect(await surveyPage.getTitle('Mes communications')).toBeVisible();

  await surveyPage.selectTab('Questionnaires');
  await expect(await surveyPage.getTitle('Questionnaire')).toBeVisible();

  await surveyPage.selectTab('Commentaire');
  await expect(await surveyPage.getTitle('Commentaire')).toBeVisible();

  await surveyPage.selectTab('Logement & Repérage');
  await expect(await page.getByText('Numéro et libellé de voie :')).toBeVisible();
  await page.getByRole('button', { name: 'Modifier' }).click();

  await expect(page.getByRole('heading', { name: "Modification de l'adresse" })).toBeVisible();

  await page.getByLabel("Complément d'adresse").click();
  await page.getByLabel("Complément d'adresse").fill('Lille');
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await expect(page.getByText('Lille')).toBeVisible();

  await surveyPage.selectTab('Contacts');
  await page.getByRole('button', { name: 'Modifier', exact: true }).click();
  await page.getByPlaceholder('JJ/MM/AAAA').first().click();
  await page.getByLabel('Choisir la date, la date sé').first().click();
  await page.getByRole('gridcell', { name: '2', exact: true }).click();
  await page.locator('div:nth-child(11) > div:nth-child(2) > .MuiButtonBase-root').click();
  await page.locator('input[name="persons\\.1\\.lastName"]').click();
  await page.locator('input[name="persons\\.1\\.lastName"]').press('ArrowLeft');
  await page.locator('input[name="persons\\.1\\.lastName"]').press('ArrowLeft');
  await page.locator('input[name="persons\\.1\\.lastName"]').press('ArrowLeft');
  await page.locator('input[name="persons\\.1\\.lastName"]').press('ArrowLeft');
  await page.locator('input[name="persons\\.0\\.lastName"]').fill('Dubuque');
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await expect(page.getByLabel('Contacts')).toContainText('Dubuque');
});

test('check if a survey has the "To synchronize" state after Unavaible', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.importData();

  const surveyPage = new SurveyPage(page);
  await page.getByRole('link', { name: 'DUBUQUE-2 Clementina-' }).click();

  await page.getByRole('button', { name: 'Identification du logement' }).click();
  await page.getByText('Logement identifié').click();
  await page.getByRole('button', { name: 'Confirmer' }).click();
  await page.getByText('Logement accessible').click();
  await page.getByRole('button', { name: 'Confirmer' }).click();
  await page
    .locator('label')
    .filter({ hasText: /^Ordinaire$/ })
    .click();
  await page.getByRole('button', { name: 'Confirmer' }).click();
  await page.getByText('Résidence principale').click();
  await page.getByRole('button', { name: 'Confirmer' }).click();
  await page.getByText('Occupant identifié').click();
  await page.getByRole('button', { name: 'Confirmer' }).click();

  await surveyPage.selectTab('Contacts');
  await surveyPage.addContactAttempt();
  await surveyPage.editContactOutcome();
  await surveyPage.forward();

  await homePage.go();
  await page.locator('div').filter({ hasText: /^GRAHAM-2 Leanne-2#questNotAvailable$/ });

  await page.getByRole('link', { name: 'Mon suivi' }).click();
  await page.getByRole('tab', { name: 'Suivi des unités par enquête' }).click();
  await page
    .getByRole('row', { name: '#su10 DUBUQUE-2 Clementina-2' })
    .locator('span')
    .first()
    .click();

  await expect(page.locator('tr:nth-child(3) > td:nth-child(3)')).toContainText('A synchroniser');
  await expect(page.locator('tr:nth-child(3) > td:nth-child(4)')).toContainText('Face à face');
  await expect(page.locator('tr:nth-child(3) > td:nth-child(5)')).toContainText(
    'Indisponibilité définitive'
  );

  await page
    .getByRole('row', { name: '#su10 DUBUQUE-2 Clementina-2' })
    .getByLabel('delete')
    .click();
  await page.getByPlaceholder('Saisissez un commentaire...').click();
  await page.getByPlaceholder('Saisissez un commentaire...').fill('Test commentaire');
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await page.getByRole('link', { name: '#su10' }).click();
  await expect(page.locator('#root')).toContainText('DUBUQUE-2 Clementina-2');
});
