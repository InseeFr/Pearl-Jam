import { expect, Page, test } from '@playwright/test';
import { HomePage } from './page-object/home.po';
import fs from 'node:fs/promises';

test.use({ locale: 'fr-FR', viewport: { width: 1920, height: 1080 } });

test('check support button functionality and file content', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.go();
    let fileContent = await getDownloadContent(page);

    expect(fileContent).toContain('Last Sync: no synch yet');


    await homePage.synchronize();

    fileContent = await getDownloadContent(page);

    // Verify the file content structure
    expect(fileContent).toMatch(/Support Data - \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/);
    expect(fileContent).toContain('Current URL: http://localhost:3000');
    expect(fileContent).toMatch(/App Version: Pearl : v \d{1,2}\.\d{1,2}\.\d{1,2}.*/);
    expect(fileContent).toMatch(/Queen Version: \d{1,2}\.\d{1,2}\.\d{1,2}.*/);
    expect(fileContent).toContain('Navigator:');
    expect(fileContent).toMatch(/Last Sync: \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/);

    // Verify date format (DD/MM/YYYY HH:MM:SS)
    expect(fileContent).toMatch(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/);
});

const getDownloadContent = async (page: Page): Promise<string> => {
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: "fichier d'assistance" }).click();
    const download = await downloadPromise;
    const path = await download.path();
    expect(path).not.toBeNull();

    expect(download.suggestedFilename()).toBe('support.txt');

    return await fs.readFile(path, 'utf-8');
}
