import { expect, test } from '@playwright/test';
import { MainPage } from '../../pages/app-page';

test.describe('Test theme toggle', async () => {
  let homePage: MainPage;

  test.use({
    // Set system preferences to `dark` mode
    colorScheme: 'dark',
  });

  test.beforeEach(async ({ page }) => {
    homePage = new MainPage(page);
    await homePage.goto();
  });

  test('Should be in dark mode by default', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dracula');
  });

  test('Dark mode should be toggled', async ({ page }) => {
    // Toggle theme
    await homePage.toggleTheme();

    // Assert that the theme has been toggled to `light` mode
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});
