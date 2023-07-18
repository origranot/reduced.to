import { test as base } from '@playwright/test';
import { generateValidEmail, generateValidName, generateValidPassword } from '../helpers/faker-utils';
import { LocalStorage } from '../helpers/local-storage';
import prisma from '../helpers/prisma';
import { LoginPage } from '../pages/authentication/login.page';
import { RegisterPage } from '../pages/authentication/register.page';
import { MainPage } from '../pages/main.page';

interface UserDetails {
  displayName: string;
  email: string;
  password: string;
}

interface AuthFixtures {
  registerPage: RegisterPage;
  loginPage: LoginPage;
  userCredentials: UserDetails;
  account: UserDetails;
  authenticatedPage: LoginPage;
  storage: LocalStorage;
}

interface MainFixture {
  mainPage: MainPage;
}

export const test = base.extend<MainFixture & AuthFixtures>({
  mainPage: async ({ page }, use) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
    await use(mainPage);
  },
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await page.waitForLoadState('networkidle');
    await use(registerPage);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.waitForLoadState('networkidle');
    await use(loginPage);
  },
  userCredentials: async ({}, use) => {
    const displayName = generateValidName();
    const email = generateValidEmail();
    const password = generateValidPassword();

    await use({
      displayName,
      email,
      password,
    });

    await prisma.user.deleteMany({ where: { email } });
  },
  account: async ({ browser, userCredentials }, use) => {
    // Create a new tab in the test's browser
    const page = await browser.newPage();

    // Navigate to the login page
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    // Fill in and submit the sign-up form
    await registerPage.fillName(userCredentials.displayName);
    await registerPage.fillEmail(userCredentials.email);
    await registerPage.fillPassword(userCredentials.password);

    await registerPage.submit();
    await page.waitForURL(/.*register\/verify.*/);

    // Verify the user
    await prisma.user.update({
      where: {
        email: userCredentials.email,
      },
      data: {
        verified: true,
      },
    });

    // Close the tab
    await page.close();

    // Provide the credentials to the test
    await use(userCredentials);
  },
  authenticatedPage: async ({ page, loginPage, account, baseURL }, use) => {
    await loginPage.fillEmail(account.email);
    await loginPage.fillPassword(account.password);
    await loginPage.submit();
    await page.waitForURL(baseURL!);
    await use(loginPage);
  },
  storage: async ({ page }, use) => {
    await use(new LocalStorage(page.context()));
  },
});

export { expect } from '@playwright/test';
