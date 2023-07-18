import { expect, test } from './fixtures';
import { routes } from './helpers/constants';
import * as myFaker from './helpers/faker-utils';

test.describe('Register page', async () => {
  const displayName = generateValidName();
  const email = generateValidEmail();
  const password = generateValidPassword();
  const passwordConstrains = 'Password must contain at least six characters, including at least 1 letter and 1 number.';

  test('Should show a heading and password constrains', async ({ page, registerPage }) => {
    await expect(registerPage.heading).toBeVisible();
    await expect(page.getByText(passwordConstrains)).toBeVisible();
  });

  test('Should toggle password visibility', async ({ registerPage }) => {
    // Toggle once
    await registerPage.togglePasswordVisibility();
    await expect(registerPage.passwordInput).toHaveAttribute('type', 'text');

    // Toggle again
    await registerPage.togglePasswordVisibility();
    await expect(registerPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('Should register a new user', async ({ page, registerPage, context, baseURL }) => {
    await registerPage.fillName(myFaker.validName());
    await registerPage.fillEmail(myFaker.validEmail());
    await registerPage.fillPassword(myFaker.validPassword());
    await registerPage.submit();

    const response = await page.waitForResponse(routes.REGISTER);
    expect(response.status()).toBe(200);

    // Should ask for email verification
    expect(page).toHaveURL(`${baseURL}register/verify/`);

    // Should show verification alert
    await expect(registerPage.verificationAlert).toBeVisible();

    // Should get cookies
    const newCookies = await context.cookies();
    expect(newCookies).toBeDefined();

    const tokensNames = newCookies.map((c) => c.name);
    expect(tokensNames).toContain('accessToken');
    expect(tokensNames).toContain('refreshToken');
  });

  test('Should not register user with existing email', async ({ page, registerPage, account, baseURL }) => {
    await registerPage.fillName(account.displayName);
    await registerPage.fillEmail(account.email);
    await registerPage.fillPassword(account.password);

    // Submit the form
    await registerPage.submit();

    // Should stay at /register page
    expect(page).toHaveURL(`${baseURL}register/`);
    await expect(page.getByText('email is already exists!')).toBeVisible();
  });

  test.describe('Invalid credentials', async () => {
    test('Short display name', async ({ page, registerPage }) => {
      await registerPage.fillName(myFaker.shortName());
      await registerPage.fillEmail(myFaker.validEmail());
      await registerPage.fillPassword(myFaker.validPassword());
      await registerPage.submit();
      await expect(page.getByText('Display name must be at least 3 characters')).toBeVisible();
    });

    test('Long display name', async ({ page, registerPage }) => {
      await registerPage.fillName(myFaker.longName());
      await registerPage.fillEmail(myFaker.validEmail());
      await registerPage.fillPassword(myFaker.validPassword());
      await registerPage.submit();
      await expect(page.getByText('Display name must be less than 25 characters')).toBeVisible();
    });

    test('Invalid email', async ({ page, registerPage }) => {
      await registerPage.fillName(myFaker.validName());
      await registerPage.fillEmail(myFaker.invalidEmail());
      await registerPage.fillPassword(myFaker.validPassword());
      await registerPage.submit();
      await expect(page.getByText('Please enter a valid email')).toBeVisible();
    });

    test('Short password', async ({ page, registerPage }) => {
      await registerPage.fillName(myFaker.validName());
      await registerPage.fillEmail(myFaker.validEmail());
      await registerPage.fillPassword(myFaker.shortPassword());
      await registerPage.submit();
      await expect(
        page.getByText('Password must contain at least six characters, including at least 1 letter and 1 number.')
      ).toBeVisible();
    });

    test('Submit empty form', async ({ page, registerPage }) => {
      await registerPage.submit();
      await expect(page.getByText('Display name must be at least 3 characters')).toBeVisible();
      await expect(page.getByText('Please enter a valid email')).toBeVisible();
      await expect(page.getByText(passwordConstrains)).toBeVisible();
    });
  });
});
