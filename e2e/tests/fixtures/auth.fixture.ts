import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/authentication/login.page';
import prisma from '../helpers/prisma';
import { faker } from '@faker-js/faker';
import { RegisterPage } from '../pages/authentication/register-page';

interface UserDetails {
  email: string;
  password: string;
}

interface AuthFixtures {
  registerPage: RegisterPage;
  loginPage: LoginPage;
  userCredentials: UserDetails;
  account: UserDetails;
}

export const test = base.extend<AuthFixtures>({
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await use(registerPage);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  userCredentials: async ({}, use) => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    await use({
      email,
      password,
    });

    // await prisma.user.deleteMany({ where: { email } });
  },
  account: async ({ browser, userCredentials }, use) => {
    // Create a new tab in the test's browser
    const page = await browser.newPage();

    // Navigate to the login page
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Fill in and submit the sign-up form
    await loginPage.fillEmail(userCredentials.email);
    await loginPage.fillPassword(userCredentials.password);

    await loginPage.submit();
    await page.waitForLoadState('networkidle');

    // Close the tab
    await page.close();

    // Provide the credentials to the test
    await use(userCredentials);
  },
});

export { expect } from '@playwright/test';
