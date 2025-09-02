import { expect, Page } from '@playwright/test';
import { GenericPage } from './generic-page.po';

export const totalSu = 25;

export class HomePage implements GenericPage {
  constructor(private readonly page: Page) {}

  async go() {
    await this.page.goto('/', { timeout: 10000 });
    await this.page.getByRole('textbox', { name: 'Username or email' }).click();
    await this.page.getByRole('textbox', { name: 'Username or email' }).fill('interv5');
    await this.page.getByRole('textbox', { name: 'Username or email' }).press('Tab');
    await this.page.getByRole('textbox', { name: 'Password' }).fill('interv5');
    await this.page.getByRole('button', { name: 'Sign In' }).click();

    const closeModalButton = this.page.getByRole('button', { name: 'Fermer' });
    if (await closeModalButton.isVisible()) {
      closeModalButton.click();
    } else {
      await this.page.goto('/', { timeout: 10000 });
    }
  }

  async synchronize() {
    const seen: any[] = [];

    const finishedRequests = new Promise<void>((resolve, reject) => {
      const listener = async (req: any) => {
        if (req.url().includes('/api/survey-unit/') && req.method() === 'GET') {
          seen.push(req);
          if (seen.length === totalSu) {
            this.page.off('requestfinished', listener);
            resolve();
          }
        }
      };

      this.page.on('requestfinished', listener);

      setTimeout(() => {
        this.page.off('requestfinished', listener);
        reject(new Error(`Timeout: Only saw ${seen.length} / ${totalSu} survey-unit requests`));
      }, 10000);
    });

    await this.page.getByRole('button', { name: 'Synchroniser' }).click();
    await finishedRequests;

    const closeModalButton = this.page.getByRole('button', { name: "J'ai compris" });
    if (await closeModalButton.isHidden()) {
      await this.page.goto('/', { timeout: 10000 });
    }
    await closeModalButton.click();
  }

  async checkNumberOfDisplayedItems(count: number) {
    await expect(
      this.page.getByText(`${count} unités sur ${totalSu}`, { exact: false })
    ).toBeVisible();
  }

  resetAllFilters() {
    return this.page.getByRole('button', { name: 'Réinitialiser les filtres' }).click();
  }
}
