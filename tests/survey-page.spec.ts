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
  await page.getByRole('button', { name: 'Modifier' }).click();

  await expect(page.getByRole('heading', { name: "Modification de l'adresse" })).toBeVisible();

  await page.getByLabel("Complément d'adresse").click();
  await page.getByLabel("Complément d'adresse").fill('Lille');
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await expect(page.getByText('Lille')).toBeVisible();
});
