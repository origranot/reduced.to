import { expect, test } from './fixtures/main.fixture';
import { routes } from './helpers/constants';
import { generateInvalidURL, generateValidURL } from './helpers/faker-utils';

test.describe('URL Shortener App', () => {
  test.beforeEach(async ({ page, mainPage }) => {
    // Enter the URL in the input field
    await mainPage.fillUrl(generateValidURL());

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

  test('Open shortened URL in a new tab', async ({ page, mainPage, context }) => {
    // Assert that the correct URL is opened in a new tab
    const [shortenedLinkTab] = await Promise.all([page.waitForEvent('popup'), mainPage.openLinkInNewTab()]);
    await shortenedLinkTab.waitForLoadState('networkidle');

    // Check if a new tab has been opened
    const pages = context.pages();

    expect(pages.length).toBeGreaterThan(1);
  });

  test('Generate shortened URL QR code', async ({ mainPage }) => {
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
    await mainPage.fillUrl(generateInvalidURL());
    await mainPage.shorten();

    const response = await page.waitForResponse(routes.SHORTEN_URL);
    const jsonResponse = await response.json();

    expect(response.status()).toBe(400); // Assert status code
    expect(jsonResponse.newUrl).toBeUndefined(); // Assert `newUrl` value
    await expect(mainPage.errorMsg).toBeVisible(); // Assert that an error is displayed
  });
});
