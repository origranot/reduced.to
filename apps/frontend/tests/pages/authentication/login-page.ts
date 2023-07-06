import type { Locator, Page } from '@playwright/test';
import { BaseAuthPage } from './base-page';

export class LoginPage extends BaseAuthPage {
  readonly registerLink: Locator;

  constructor(page: Page) {
    super(page, 'login');
    this.registerLink = this.page.locator('a[href="/register"]');
  }

  async gotoRegister() {
    await this.registerLink.click();
  }
}
