import { expect, test } from './fixtures/auth.fixture';
import {
  generateInvalidEmail,
  generateLongName,
  generateShortName,
  generateShortPassword,
  generateValidEmail,
  generateValidName,
  generateValidPassword,
} from './helpers/faker-utils';

test.describe('Register page', async () => {
  const displayName = generateValidName();
  const email = generateValidEmail();
  const password = generateValidPassword();
  const passwordConstrains = 'Password must contain at least six characters, including at least 1 letter and 1 number.';

  test('Heading and password constrains', async ({ page, registerPage }) => {
    await expect(registerPage.heading).toBeVisible();

    // Should show password constrains
    const passwordError = page.getByText(passwordConstrains);
    await expect(passwordError).toBeVisible();
  });

  test('New user registration', async ({ page, registerPage, context }) => {
    // Populate in the form
    await registerPage.fillName(displayName);
    await registerPage.fillEmail(email);
    await registerPage.fillPassword(password);

    // Check password visibility toggler
    await registerPage.togglePasswordVisibility();
    await expect(registerPage.passwordInput).toHaveAttribute('type', 'text');

    // Toggle again
    await registerPage.togglePasswordVisibility();
    await expect(registerPage.passwordInput).toHaveAttribute('type', 'password');

    // Submit the form
    await registerPage.submit();
    await page.waitForURL(/.*register\/verify.*/);

    // Should ask for email verification
    expect(page.url()).toMatch(/.*register\/verify.*/);

    // Should show verification alert
    await expect(registerPage.verificationAlert).toBeVisible();

    // Should get cookies
    const newCookies = await context.cookies();
    expect(newCookies).toBeDefined();

    const tokensNames = newCookies.map((c) => c.name);
    expect(tokensNames).toContain('accessToken');
    expect(tokensNames).toContain('refreshToken');
  });

  test('Should not register user with existing email', async ({ page, registerPage, account }) => {
    // Populate in the form
    await registerPage.fillName(account.displayName);
    await registerPage.fillEmail(account.email);
    await registerPage.fillPassword(account.password);

    // Submit the form
    await registerPage.submit();

    // Should stay at `register` page
    expect(page.url()).toMatch(/.*register\//);

    // Should show an error message
    const errorMsg = page.getByText('email is already exists!');
    await expect(errorMsg).toBeVisible();
  });

  test('Short display name', async ({ page, registerPage }) => {
    // Fill short name
    await registerPage.fillName(generateShortName());
    await registerPage.fillEmail(generateValidEmail());
    await registerPage.fillPassword(generateValidPassword());

    await registerPage.submit();

    // Should show an error message
    const errorMsg = page.getByText('Display name must be at least 3 characters');
    await expect(errorMsg).toBeVisible();
  });

  test('Long display name', async ({ page, registerPage }) => {
    // Fill long name
    await registerPage.fillName(generateLongName());
    await registerPage.fillEmail(generateValidEmail());
    await registerPage.fillPassword(generateValidPassword());

    await registerPage.submit();

    // Should show an error message
    const errorMsg = page.getByText('Display name must be less than 25 characters');
    await expect(errorMsg).toBeVisible();
  });

  test('Invalid email', async ({ page, registerPage }) => {
    await registerPage.fillName(generateValidName());
    // Fill invalid email
    await registerPage.fillEmail(generateInvalidEmail());
    await registerPage.fillPassword(generateValidPassword());

    await registerPage.submit();

    // Should show an error message
    const errorMsg = page.getByText('Please enter a valid email');
    await expect(errorMsg).toBeVisible();
  });

  test('Short password', async ({ page, registerPage }) => {
    await registerPage.fillName(generateValidName());
    await registerPage.fillEmail(generateValidEmail());
    // Fill in short password
    await registerPage.fillPassword(generateShortPassword());

    await registerPage.submit();

    // Should show an error message
    const errorMsg = page.getByText('Password must contain at least six characters, including at least 1 letter and 1 number.');
    await expect(errorMsg).toBeVisible();
  });

  test('Fill empty fields', async ({ page, registerPage }) => {
    // Submit an empty form
    await registerPage.submit();

    // Should show error messages
    const displayNameError = page.getByText('Display name must be at least 3 characters');
    await expect(displayNameError).toBeVisible();

    const emailError = page.getByText('Please enter a valid email');
    await expect(emailError).toBeVisible();

    const passwordError = page.getByText(passwordConstrains);
    await expect(passwordError).toBeVisible();
  });
});
