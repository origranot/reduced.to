import { expect, test } from '@playwright/test';

test.describe('Test theme toggle', async () => {
  // Set system preferences to `light` mode
  test.use({
    colorScheme: 'light',
  });

  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('./');
  });

  test('Should be in light mode by default', async ({ page }) => {
    // Assert that the theme is in `light` mode
    await page.waitForTimeout(3000);

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('Light mode should be toggled', async ({ page }) => {
    // Toggle theme
    await page.locator('[aria-label="Switch theme"]').click();
    await page.waitForTimeout(3000);

    // Assert that the theme has been toggled
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dracula');
  });
});
