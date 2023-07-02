import { expect, test } from '@playwright/test';

test.describe('Register', async () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the /register route
    await page.goto('./register');
  });

  test('Heading check', async ({ page }) => {
    const heading = await page.getByRole('heading').first().innerText();
    expect(heading).toMatch(/Create an account/);
  });

  // NOTE: this will fail after the first test since the email is already in DB. 
  // Should we use pg-mem for tests?
  test('New user registration', async ({ page }) => {
    // Fill in the form
    await page.locator('input[name="displayName"]').fill('example');
    await page.locator('input[name="email"]').fill('example@gmail.com');
    await page.locator('input[name="password"]').fill('examplePass123');

    // Submit the form
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(3000);

    // Assert that the correct URL is opened in a new tab
    expect(page.url()).toMatch(/.*\/register\/verify/);
  });
});
