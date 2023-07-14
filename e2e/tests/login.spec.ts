import { expect, test } from './fixtures/auth.fixture';
import { generateInvalidEmail, generateShortPassword, generateValidEmail, generateValidPassword } from './helpers/faker-utils';

test.describe('User login', async () => {
  test('Heading check', async ({ loginPage }) => {
    await expect(loginPage.heading).toBeVisible();

    const titleContent = await loginPage.heading.textContent();
    expect(titleContent).toMatch('Welcome back!');
  });

  test('Successful user login', async ({ page, loginPage, account, baseURL }) => {
    await loginPage.fillEmail(account.email);
    await loginPage.fillPassword(account.password);

    await loginPage.submit();
    await page.waitForURL(/^(?!.*login).*$/);

    // Should redirect to home page after logged in
    expect(page.url()).toBe(baseURL || 'http://localhost:5173/');

    // Avatar should be visible
    await expect(loginPage.navbar.avatar).toBeVisible();
    await expect(loginPage.navbar.loginButton).not.toBeVisible();
  });

  test('Invalid email or password', async ({ page, loginPage }) => {
    // Fill in random credentials
    await loginPage.fillEmail(generateValidEmail());
    await loginPage.fillPassword(generateValidPassword());

    await loginPage.submit();

    // Should show an error message
    const errorMsg = page.getByText('Invalid email or password');
    await expect(errorMsg).toBeVisible();
  });

  test('Invalid email', async ({ page, loginPage }) => {
    // Fill in a random string
    await loginPage.fillEmail(generateInvalidEmail());
    await loginPage.fillPassword(generateValidPassword());

    await loginPage.submit();

    // Should show an error message
    const errorMsg = page.getByText('Please enter a valid email');
    await expect(errorMsg).toBeVisible();
  });

  test('Short password', async ({ page, loginPage }) => {
    await loginPage.fillEmail(generateValidEmail());
    // Fill in short password
    await loginPage.fillPassword(generateShortPassword());

    await loginPage.submit();

    // Should show an error message
    const errorMsg = page.getByText('Password must be at least 6 characters');
    await expect(errorMsg).toBeVisible();
  });
});
