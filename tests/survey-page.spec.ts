import { test, expect } from '@playwright/test';
import { HomePage } from './page-object/home.po';
import { SurveyPage } from './page-object/survey.po';

test.use({ locale: 'fr-FR', viewport: { width: 1920, height: 1080 } });

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

test('check if a survey has the "To synchronize" state after Unavaible', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.synchronize();

  const surveyPage = new SurveyPage(page);
  await page.getByRole('link', { name: 'MOREAU Isabelle' }).click();

  await page.getByRole('button', { name: "Identification de l'adresse" }).click();
  await page.getByText('Adresse identifiée avec un bâtiment', { exact: true }).click();
  await page.getByRole('button', { name: 'Confirmer' }).click();
  await page.getByRole('heading', { name: 'Identification du logement' }).isVisible();
  await page.getByText('Logement identifié').click();
  await page.getByRole('button', { name: 'Confirmer' }).click();
  await page.getByRole('heading', { name: 'Situation du logement' }).isVisible();
  await page.getByText("Logement absorbé ou ayant perdu son usage d'habitation").click();
  await page.getByRole('button', { name: 'Confirmer' }).click();

  await surveyPage.selectTab('Contacts');
  await surveyPage.addContactAttempt();
  await surveyPage.setContactOutcomeAsDUK();
  await surveyPage.forward();

  await homePage.goToRootPage();

  page.locator('div').filter({ hasText: /^MOREAU Isabelle#questNotAvailable$/ });

  await page.getByRole('button', { name: 'Fermer' }).click();
  await page.getByRole('link', { name: 'Mon suivi' }).click();
  await page.getByRole('tab', { name: 'Suivi des unités par enquête' }).click();
  await page.getByRole('cell', { name: 'MOREAU Isabelle' }).click();

  const row = page.getByRole('row', { name: 'MOREAU Isabelle' });
  await expect(row.getByRole('cell', { name: 'A synchroniser' })).toBeVisible();
  await expect(row.getByText('Face à face')).toBeVisible();

  await row.getByRole('button').click();
  await page.getByPlaceholder('Saisissez un commentaire...').click();
  await page.getByPlaceholder('Saisissez un commentaire...').fill('Test commentaire');
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await page.getByRole('link', { name: '#business-id-proto01' }).click();
  await expect(page.getByText('MOREAU Isabelle')).toBeVisible();
});

test('Check previous collect history, modify next collect history and synchronize', async ({
  page,
}) => {
  const homePage = new HomePage(page);
  await homePage.go();
  await homePage.synchronize();
  await page.getByRole('checkbox', { name: 'Masquer les unités terminées' }).uncheck();
  await page.getByRole('link', { name: 'SIMMONS Earl' }).click();
  await page.getByRole('tab', { name: 'Collecte précédente' }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Bilan des contacts : Enquête acceptée$/ })
    .nth(1)
    .click();
  await expect(page.getByRole('cell', { name: 'M' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Clifford' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: '23' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Oui' }).first()).toBeVisible();

  await page.getByRole('tab', { name: 'Collecte suivante' }).click();
  await expect(page.getByRole('tab', { name: 'Collecte suivante' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'M' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Gary' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Grice' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'test@test.com' }).first()).toBeVisible();

  await page.getByRole('button', { name: 'Ajouter un individu' }).click();
  await page.getByRole('radio', { name: 'M', exact: true }).check();
  await page.getByRole('textbox', { name: 'Nom *', exact: true }).click();
  await page.getByRole('textbox', { name: 'Nom *', exact: true }).fill('Hugue');
  await page.getByRole('textbox', { name: 'Prénom *' }).click();
  await page.getByRole('textbox', { name: 'Prénom *' }).fill('Hugo');
  await page.getByRole('textbox', { name: 'Téléphone' }).click();
  await page.getByRole('textbox', { name: 'Téléphone' }).fill('01010101');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test2@gmail.com');
  await page.getByRole('radio', { name: 'Oui' }).click();
  await page.getByRole('button', { name: "J'ai compris" }).click();
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  const row = page.getByRole('row', { name: 'Gary' });
  await row.getByRole('button', { name: 'Supprimer' }).click();
  await page.getByRole('button', { name: 'Confirmer' }).click();

  await homePage.synchronize();

  await page.getByRole('link', { name: 'SIMMONS Earl' }).click();
  await page.getByRole('tab', { name: 'Collecte suivante' }).click();
  await expect(page.getByRole('cell', { name: 'Gary' })).toBeHidden();
  await expect(page.getByRole('cell', { name: 'Grice' })).toBeHidden();
  await expect(page.getByRole('cell', { name: 'Hugue' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Hugo' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'test2@gmail.com' })).toBeVisible();
});
