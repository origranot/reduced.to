import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/app-page';

test.describe('Main page', async () => {
  let homePage: MainPage;

  test.beforeEach(async ({ page }) => {
    homePage = new MainPage(page);
    await homePage.goto();
  });

  test('Title check', async ({ page }) => {
    await expect(page).toHaveTitle('The FREE Open-Source URL Shortener | Reduced.to');
  });

  test('Open GitHub repository', async ({ page }) => {
    const [githubTab] = await Promise.all([page.waitForEvent('popup'), homePage.gotoGithub()]);
    expect(githubTab.url()).toMatch('https://github.com/origranot/reduced.to');
  });

  test('Open documentation page', async ({ page }) => {
    await homePage.gotoDocs();
    expect(page.url()).toContain('docs');
  });

  test('Go to login route', async ({ page }) => {
    await homePage.gotoLogin();
    await page.waitForURL(/.*\/login\/$/);
    expect(page.url()).toContain('login');
  });

  test('Input box', async () => {
    await expect(homePage.urlInput).toBeVisible();
    await expect(homePage.urlInput).toBeEmpty();
    await expect(homePage.urlInput).toBeEditable();
  });

  test('Submit button', async () => {
    await expect(homePage.submitButton).toBeDisabled();

    // Fill URL input to enable submit button
    await homePage.urlInput.fill('google.com');
    await expect(homePage.submitButton).toBeEnabled();
  });

  test('URL expiration dropdown pallet should be disabled', async () => {
    await expect(homePage.linkExpDropDown).toBeDisabled();
  });
});
