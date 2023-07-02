import { expect, test } from '@playwright/test';

test.describe('Test theme toggle', async () => {
  // Set system preferences to `dark` mode
  test.use({
    colorScheme: 'dark',
  });

  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('./');
  });

  test('Should be in dark mode by default', async ({ page }) => {
    // Assert that the theme is in `dark` mode
    await page.waitForTimeout(3000);

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dracula');
  });

  test('Dark mode should be toggled', async ({ page }) => {
    // Toggle theme
    await page.locator('[aria-label="Switch theme"]').click();
    await page.waitForTimeout(3000);

    // Assert that the theme has been toggled
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});
