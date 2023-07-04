import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class RegisterPage extends BasePage {
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = this.page.locator('h1', { hasText: 'Create an account' });
    this.nameInput = this.page.locator('input[name="displayName"]');
    this.emailInput = this.page.locator('input[name="email"]');
    this.passwordInput = this.page.locator('input[name="password"]');
    this.submitButton = this.page.locator('button', { hasText: 'Continue' });
  }

  async goto() {
    await this.page.goto('./register');
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }
}
