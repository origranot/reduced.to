import { expect, test } from './fixtures';

test.describe('Test theme toggle', async () => {
  test.use({
    // Set system preferences to `dark` mode
    colorScheme: 'dark',
  });

  test('Should be in dark mode by default', async ({ page, mainPage }) => {
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dracula');
  });

  test('Dark mode should be toggled', async ({ page, mainPage }) => {
    // Toggle theme
    await mainPage.navbar.toggleTheme();

    // Assert that the theme has been toggled to `light` mode
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});

test.describe('Test theme toggle', async () => {
  test.use({
    // Set system preferences to `light` mode
    colorScheme: 'light',
  });

  test('Should be in light mode by default', async ({ page, mainPage }) => {
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('Light mode should be toggled', async ({ page, mainPage }) => {
    // Toggle theme
    await mainPage.navbar.toggleTheme();

    // Assert that the theme has been toggled to `dark` mode
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dracula');
  });
});
