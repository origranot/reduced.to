import type { Locator, Page } from '@playwright/test';
import { BaseAuthPage } from './base.page';

export class LoginPage extends BaseAuthPage {
  readonly registerLink: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page, 'login');
    this.registerLink = this.page.locator('a[href="/register"]');
    this.submitButton = this.page.locator('button', { hasText: 'Log in' });
  }

  async gotoRegister() {
    await this.registerLink.click();
  }

  async submit() {
    await this.submitButton.click();
  }
}
