import { expect, test } from '@playwright/test';
import { routes } from '../utils/constants';
import { mockResponses } from '../utils/mock-responses';
import { MainPage } from '../pages/app-page';

test.describe('URL Shortener App - guest mode', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    await page.route(routes.SHORTEN_URL, (route) => {
      route.fulfill(mockResponses.SHORTEN_URL);
    });

    mainPage = new MainPage(page);

    await mainPage.goto();

    // Enter the URL in the input field
    const inputUrl = 'google.com';
    await mainPage.fillUrl(inputUrl);

    // Click the `SHORTEN URL` button
    await mainPage.shorten();

    const response = await page.waitForResponse(routes.SHORTEN_URL);
    const jsonResponse = await response.json();
    const mockUrl = JSON.parse(mockResponses.SHORTEN_URL.body!).newUrl;

    expect(response.status()).toBe(201); // Assert status code
    expect(jsonResponse.newUrl).toBe(mockUrl); // Assert `newUrl` value
  });

  test('Copy the shortened URL', async ({ page }) => {
    // Assert that the shortened URL is displayed correctly
    await expect(mainPage.shortenedLink).toBeVisible();

    await mainPage.copyUrl();

    const shortenedUrl = await mainPage.getShortenedUrl();
    const clipboardData = await page.evaluate(() => navigator.clipboard.readText());

    // Assert that the URL has been copied
    expect(clipboardData).toBe(shortenedUrl);
  });

  test('Open shortened URL in a new tab', async ({ page }) => {
    // Assert that the correct URL is opened in a new tab
    const [shortenedLinkTab] = await Promise.all([page.waitForEvent('popup'), mainPage.openLinkInNewTab()]);

    // Check if a new tab has been opened
    const isOpen = await shortenedLinkTab.evaluate(() => !!window.opener);
    expect(isOpen).toBeTruthy(); // Expect a new tab to be opened
  });

  test('Generate shortened URL QR code', async ({ page }) => {
    // Click the `QR code` button
    await mainPage.showQRCode();

    // Assert that the QR code is displayed
    await expect(mainPage.qrCode).toBeVisible();
  });

  test('Share shortened URL on Twitter', async ({ page }) => {
    const shareOnTwitterLinkPattern = new RegExp(/https:\/\/twitter\.com\/.*\/share\?text=[^&]+&url=[^&]+&hashtags=[^&]+/);
    const [twitterTab] = await Promise.all([page.waitForEvent('popup'), mainPage.shareOnTwitter()]);

    const decodedUrl = decodeURIComponent(twitterTab.url());

    // Assert that the correct URL is opened in a new tab
    expect(decodedUrl).toMatch(shareOnTwitterLinkPattern);
  });
});
