import type { Locator, Page } from '@playwright/test';
import { AuthRoutes, BasePage } from '../base-page';

export class BaseAuthPage extends BasePage {
  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordVisibilityToggler: Locator;
  readonly submitButton: Locator;

  constructor(page: Page, route: AuthRoutes) {
    super(page, route);
    this.heading = this.page.locator('h1', { hasText: 'Create an account' });
    this.emailInput = this.page.locator('input[name="email"]');
    this.passwordInput = this.page.locator('input[name="password"]');
    this.passwordVisibilityToggler = this.page.locator('input[name="password"] > span');
    this.submitButton = this.page.locator('button', { hasText: 'Continue' });
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async togglePasswordVisibility() {
    await this.passwordVisibilityToggler.click();
  }

  async submit() {
    await this.submitButton.click();
  }
}
