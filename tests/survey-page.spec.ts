import { test, expect } from '@playwright/test';
import { HomePage } from './page-object/home.po';
import { SurveyPage } from './page-object/survey.po';

test('check if all tabs work properly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.synchronize();

  const surveyPage = new SurveyPage(page);

  await page.getByRole('link', { name: 'RAYMOND Harriette' }).click();

  await expect(surveyPage.getTitle('Logement')).toBeVisible();

  await surveyPage.selectTab('Contacts');
  await expect(surveyPage.getTitle('Individu')).toBeVisible();

  await surveyPage.selectTab('Communications');
  await expect(surveyPage.getTitle('Mes communications')).toBeVisible();

  await surveyPage.selectTab('Questionnaires');
  await expect(surveyPage.getTitle('Questionnaire')).toBeVisible();

  await surveyPage.selectTab('Commentaire');
  await expect(surveyPage.getTitle('Commentaire')).toBeVisible();

  await surveyPage.selectTab('Logement & Repérage');
  await expect(page.getByText('Numéro et libellé de voie :')).toBeVisible();
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
  await page.getByRole('textbox', { name: 'Nom *', exact: true }).fill('Dubuque');
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await expect(page.getByLabel('Contacts')).toContainText('Dubuque');
});

test.skip('check if a survey has the "To synchronize" state after Unavaible', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.synchronize();

  const surveyPage = new SurveyPage(page);
  await page.getByRole('link', { name: 'MOREAU Isabelle' }).click();

  await page.getByRole('button', { name: 'Identification du logement' }).click();
  await page.getByText('Logement identifié').click();
  await page.getByRole('button', { name: 'Confirmer' }).click();
  await page.getByText('Catégorie du logement').click();
  await page.getByText('Résidence principale').click();
  await page.getByRole('button', { name: 'Confirmer' }).click();

  await surveyPage.selectTab('Contacts');
  await surveyPage.addContactAttempt();
  await surveyPage.editContactOutcome();
  await surveyPage.forward();

  await homePage.go();
  page.locator('div').filter({ hasText: /^MOREAU Isabelle#questNotAvailable$/ });

  await page.getByRole('link', { name: 'Mon suivi' }).click();
  await page.getByRole('tab', { name: 'Suivi des unités par enquête' }).click();
  await page.getByRole('row', { name: '#su10 MOREAU Isabell' }).locator('span').first().click();

  await expect(page.locator('tr:nth-child(3) > td:nth-child(3)')).toContainText(
    'A repérer/Contacter'
  );
  await expect(page.locator('tr:nth-child(3) > td:nth-child(4)')).toContainText('Face à face');

  await page.getByRole('row', { name: '#su10 MOREAU Isabell' }).getByRole('button').click();
  await page.getByPlaceholder('Saisissez un commentaire...').click();
  await page.getByPlaceholder('Saisissez un commentaire...').fill('Test commentaire');
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await page.getByRole('link', { name: '#su10' }).click();
  await expect(page.locator('#root')).toContainText('MOREAU Isabell');
});

test('Check previous collect history, modify next collect history and synchronize', async ({
  page,
}) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.synchronize();

  const surveyPage = new SurveyPage(page);
  await page.getByRole('checkbox', { name: 'Masquer les unités terminées' }).uncheck();
  await page.getByRole('link', { name: 'FARMER Ted' }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Bilan des contacts :INA$/ })
    .nth(1)
    .click();
  await expect(page.getByRole('cell', { name: 'MISTER' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Isidore' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Opre' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: '45' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Oui' }).first()).toBeVisible();

  await page.getByRole('tab', { name: 'Collecte suivante' }).click();

  await expect(page.getByRole('tab', { name: 'Collecte suivante' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'MISTER' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'TURE' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Fu' })).toBeVisible();

  await page.getByRole('cell', { name: 'test@test.com' }).click();
  await page.getByRole('button', { name: 'Ajouter une ligne de coordonn' }).click();
  await page.getByRole('radio', { name: 'M', exact: true }).check();
  await page.getByRole('textbox', { name: 'Nom *', exact: true }).click();
  await page.getByRole('textbox', { name: 'Nom *', exact: true }).fill('Soudiere');
  await page.getByRole('textbox', { name: 'Prénom *' }).click();
  await page.getByRole('textbox', { name: 'Prénom *' }).fill('Hugo');
  await page.getByRole('textbox', { name: 'Téléphone' }).click();
  await page.getByRole('textbox', { name: 'Téléphone' }).fill('01010101');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('purpleposse@gmail.com');
  await page.getByRole('radio', { name: 'Oui' }).check();
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await page.getByRole('button', { name: 'Supprimer' }).first().click();
  await page.getByRole('button', { name: 'Confirmer' }).click();

  homePage.synchronize();

  await expect(page.getByRole('tab', { name: 'Collecte suivante' })).toBeHidden();
  await expect(page.getByRole('cell', { name: 'MISTER' })).toBeHidden();
  await expect(page.getByRole('cell', { name: 'TURE' })).toBeHidden();
  await expect(page.getByRole('cell', { name: 'Fu' })).toBeHidden();
  await expect(page.getByRole('cell', { name: 'MISTER' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'SOUDIERE' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Hugo' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'purpleposse@gmail.com' }).first()).toBeVisible();
});
