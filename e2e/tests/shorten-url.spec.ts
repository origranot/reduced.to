import { expect, test } from './fixtures/main.fixture';
import { routes } from './helpers/constants';
import { faker } from '@faker-js/faker';

test.describe('URL Shortener App', () => {
  test.beforeEach(async ({ page, mainPage }) => {
    // Enter the URL in the input field
    const inputUrl = faker.internet.url();
    await mainPage.fillUrl(inputUrl);

    // Click the `SHORTEN URL` button
    await mainPage.shorten();

    const response = await page.waitForResponse(routes.SHORTEN_URL);
    const jsonResponse = await response.json();

    expect(response.status()).toBe(201); // Assert status code
    expect(jsonResponse.newUrl).toBeTruthy(); // Assert `newUrl` value
  });

  test('Copy the shortened URL', async ({ page, mainPage }) => {
    // Assert that the shortened URL is displayed correctly
    await expect(mainPage.shortenedLink).toBeVisible();

    await mainPage.copyUrl();

    const shortenedUrl = await mainPage.getShortenedUrl();
    const clipboardData = await page.evaluate(() => navigator.clipboard.readText());

    // Assert that the URL has been copied
    expect(clipboardData).toBe(shortenedUrl);
  });

  test('Open shortened URL in a new tab', async ({ page, mainPage }) => {
    // Assert that the correct URL is opened in a new tab
    const [shortenedLinkTab] = await Promise.all([page.waitForEvent('popup'), mainPage.openLinkInNewTab()]);
    await shortenedLinkTab.waitForLoadState();

    // Check if a new tab has been opened
    const title = await shortenedLinkTab.title();
    expect(title).toBeTruthy();
  });

  test('Generate shortened URL QR code', async ({ page, mainPage }) => {
    // Click the `QR code` button
    await mainPage.showQRCode();

    // Assert that the QR code is displayed
    await expect(mainPage.qrCode).toBeVisible();
  });

  test('Share shortened URL on Twitter', async ({ page, mainPage }) => {
    const shareOnTwitterLinkPattern = new RegExp(/https:\/\/twitter\.com\/.*\/share\?text=[^&]+&url=[^&]+&hashtags=[^&]+/);
    const [twitterTab] = await Promise.all([page.waitForEvent('popup'), mainPage.shareOnTwitter()]);

    const decodedUrl = decodeURIComponent(twitterTab.url());

    // Assert that the correct URL is opened in a new tab
    expect(decodedUrl).toMatch(shareOnTwitterLinkPattern);
  });
});

test.describe('Invalid input URL', () => {
  test('Should raise an error', async ({ page, mainPage }) => {
    const invalidUrl = faker.internet.domainWord();
    await mainPage.fillUrl(invalidUrl);
    await mainPage.shorten();

    const response = await page.waitForResponse(routes.SHORTEN_URL);
    const jsonResponse = await response.json();

    expect(response.status()).toBe(400); // Assert status code
    expect(jsonResponse.newUrl).toBeUndefined(); // Assert `newUrl` value
    await expect(mainPage.errorMsg).toBeVisible(); // Assert that am error is displayed
  });
});
