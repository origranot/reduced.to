import { expect, test } from './fixtures';

test.describe('Main page', async () => {
  test('Main page should display a heading', async ({ page, mainPage }) => {
    await expect(page).toHaveTitle('The FREE Open-Source URL Shortener | Reduced.to');
  });

  test('Open GitHub repository', async ({ page, mainPage }) => {
    const [githubTab] = await Promise.all([page.waitForEvent('popup'), mainPage.navbar.gotoGithub()]);
    await expect(githubTab).toHaveURL('https://github.com/origranot/reduced.to');
  });

  test('Open documentation page', async ({ page, mainPage }) => {
    await mainPage.navbar.gotoDocs();
    await expect(page).toHaveURL('https://docs.reduced.to/overview');
  });

  test('Press the `login` button', async ({ page, mainPage, baseURL }) => {
    await mainPage.navbar.gotoLogin();
    await expect(page).toHaveURL(`${baseURL!}login/`);
  });

  test('Input box', async ({ mainPage }) => {
    await expect(mainPage.urlInput).toBeVisible();
    await expect(mainPage.urlInput).toBeEmpty();
    await expect(mainPage.urlInput).toBeEditable();
  });

  test('Submit button', async ({ mainPage }) => {
    await expect(mainPage.submitButton).toBeDisabled();

    // Fill URL input field to enable submit button
    await mainPage.urlInput.fill('google.com');
    await expect(mainPage.submitButton).toBeEnabled();
  });

  test('URL expiration dropdown pallet should be disabled when logged out', async ({ mainPage }) => {
    await expect(mainPage.linkExpDropDown).toBeDisabled();
  });
});
