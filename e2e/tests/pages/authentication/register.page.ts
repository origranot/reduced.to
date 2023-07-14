import type { Locator, Page } from '@playwright/test';
import { BaseAuthPage } from './base.page';

export class RegisterPage extends BaseAuthPage {
  readonly nameInput: Locator;
  readonly submitButton: Locator;
  readonly heading: Locator;
  readonly passwordVisibilityToggler: Locator;
  readonly verificationAlert = this.page
    .locator('div')
    .filter({ hasText: 'Your account is not verified, you may not be able to access all features of the ' })
    .first();

  constructor(page: Page) {
    super(page, 'register');
    this.nameInput = this.page.locator('input[name="displayName"]');
    this.submitButton = this.page.locator('button', { hasText: 'Continue' });
    this.heading = this.page.locator('h1', { hasText: 'Create an account' });
    this.passwordVisibilityToggler = this.page.getByRole('main').getByRole('img');
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async submit() {
    await this.submitButton.click();
  }

  async togglePasswordVisibility() {
    await this.passwordVisibilityToggler.click();
  }
}
