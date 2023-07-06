import type { Locator, Page } from '@playwright/test';

export type AuthRoutes = 'register' | 'login' | '';

export class BasePage {
  protected readonly page: Page;
  readonly route: AuthRoutes;
  readonly toggleThemeButton: Locator;
  readonly githubRepoButton: Locator;
  readonly docsButton: Locator;
  readonly loginButton: Locator;

  constructor(page: Page, route: AuthRoutes) {
    this.page = page;
    this.route = route;
    this.toggleThemeButton = this.page.getByRole('button', { name: 'Switch Theme' });
    this.githubRepoButton = this.page.getByRole('link').nth(3);
    this.docsButton = this.page.getByRole('link', { name: 'Docs' });
    this.loginButton = this.page.getByRole('link', { name: 'Login' });
  }

  async goto() {
    await this.page.goto(`./${this.route}`);
  }

  async toggleTheme() {
    await this.toggleThemeButton.click();
  }

  async gotoGithub() {
    await this.githubRepoButton.click();
  }

  async gotoDocs() {
    await this.docsButton.click();
  }

  async gotoLogin() {
    await this.loginButton.click();
  }
}
