import { expect, test } from './fixtures';
import { routes } from './helpers/constants';
import * as myFaker from './helpers/faker-utils';

test.describe('Login', async () => {
  test('Login page should display a heading', async ({ loginPage }) => {
    await expect(loginPage.heading).toBeVisible();
  });

  test.describe('Logged in user', () => {
    test('Should redirect to home page after logging in', async ({ page, loginPage, account, baseURL }) => {
      await loginPage.fillEmail(account.email);
      await loginPage.fillPassword(account.password);
      await loginPage.submit();

      // Check status code
      const response = await page.waitForResponse(routes.LOGIN);
      expect(response.status()).toBe(200);

      await expect(page).toHaveURL(baseURL!);
    });

    test('Should get cookies after logging in', async ({ authenticatedPage, context }) => {
      let newCookies = await context.cookies();
      expect(newCookies.length).toBeGreaterThanOrEqual(2);
    });

    test('Should display avatar and hide login button after logging in', async ({ authenticatedPage }) => {
      await expect(authenticatedPage.navbar.avatar).toBeVisible();
      await expect(authenticatedPage.navbar.loginButton).not.toBeVisible();
    });

    test('Should display menu buttons after opening the menu', async ({ authenticatedPage }) => {
      await authenticatedPage.navbar.avatar.click();
      await expect(authenticatedPage.navbar.logoutButton).toBeVisible();
      await expect(authenticatedPage.navbar.dashboardButton).toBeVisible();
    });

    test("Should be able to navigate to user's dashboard", async ({ page, authenticatedPage, baseURL }) => {
      await authenticatedPage.navbar.avatar.click();
      await authenticatedPage.navbar.gotoDashboard();
      await expect(page).toHaveURL(`${baseURL!}dashboard/`);
    });

    test('URL expiration dropdown pallet should be enabled when logged in', async ({ authenticatedPage, mainPage }) => {
      await expect(mainPage.linkExpDropDown).toBeEnabled();
    });

    test('Log out', async ({ page, authenticatedPage, context, baseURL }) => {
      await authenticatedPage.navbar.avatar.click();
      await authenticatedPage.navbar.logout();

      // Should redirect to the home page
      await expect(page).toHaveURL(baseURL!);

      // Should display login button and hide avatar
      await expect(authenticatedPage.navbar.loginButton).toBeVisible();
      await expect(authenticatedPage.navbar.avatar).not.toBeVisible();

      // Should remove cookies
      let newCookies = await context.cookies();
      expect(newCookies.length).toBeLessThanOrEqual(0);
    });
  });

  test.describe('Invalid credentials', async () => {
    test('Invalid email or password', async ({ page, loginPage }) => {
      await loginPage.fillEmail(myFaker.validEmail());
      await loginPage.fillPassword(myFaker.validPassword());
      await loginPage.submit();
      await expect(page.getByText('Invalid email or password')).toBeVisible();
    });

    test('Invalid email', async ({ page, loginPage }) => {
      await loginPage.fillEmail(myFaker.invalidEmail());
      await loginPage.fillPassword(myFaker.validPassword());
      await loginPage.submit();
      await expect(page.getByText('Please enter a valid email')).toBeVisible();
    });

    test('Short password', async ({ page, loginPage }) => {
      await loginPage.fillEmail(myFaker.validEmail());
      await loginPage.fillPassword(myFaker.shortPassword());
      await loginPage.submit();
      await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    });

    test('Submit empty form', async ({ page, loginPage }) => {
      await loginPage.submit();
      await expect(page.getByText('Please enter a valid email')).toBeVisible();
      await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    });
  });
});
