import type { Locator, Page } from '@playwright/test';

export class Navbar {
  protected readonly page: Page;
  readonly toggleThemeButton: Locator;
  readonly githubRepoButton: Locator;
  readonly docsButton: Locator;
  readonly loginButton: Locator;
  readonly avatar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toggleThemeButton = this.page.getByRole('button', { name: 'Switch Theme' });
    this.githubRepoButton = this.page.getByRole('link').nth(3);
    this.docsButton = this.page.getByRole('link', { name: 'Docs' });
    this.loginButton = this.page.getByRole('link', { name: 'Login' });
    this.avatar = this.page.locator('.avatar');
  }

  async toggleTheme() {
    await this.toggleThemeButton.click();
  }

  async gotoGithub() {
    await this.githubRepoButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async gotoDocs() {
    await this.docsButton.click();
    await this.page.waitForURL(/.*docs.*/);
  }

  async gotoLogin() {
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
