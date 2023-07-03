import { expect, test } from '@playwright/test';
import { HomePage } from './pages/home-page';
import { routes } from './constants';
import { mockResponses } from './mock-data/mock-responses';
import type { MockResponse, ResponseBody } from './mock-data/types';

test.describe('URL Shortener App - guest mode', () => {
  let homePage: HomePage;

  // Enter a URL to shorten before testing the output options
  test.beforeEach(async ({ page }) => {
    await page.route(routes.SHORTEN_URL, (route) => {
      route.fulfill(mockResponses.SHORTEN_URL);
    });

    homePage = new HomePage(page);

    // Go to home page
    await homePage.navigate();
    await expect(page).toHaveTitle(/The FREE Open-Source URL Shortener | Reduced.to/);

    // Enter the URL in the input field
    const inputUrl = 'google.com';
    await homePage.enterUrl(inputUrl);

    // Click the `SHORTEN URL` button
    await homePage.shortenUrl();

    const response = await page.waitForResponse(routes.SHORTEN_URL);
    const responseBody = await response.json();

    expect(response.status()).toBe(201); // Assert status code
    expect(responseBody.newUrl).toBe(JSON.parse(mockResponses.SHORTEN_URL.body)?.newUrl); // Assert `newUrl` value
  });

  test('Copy the shortened URL', async ({ page }) => {
    // Assert that the shortened URL is displayed correctly
    const shortenedUrl = await homePage.getShortenedUrl();
    // expect(shortenedUrl).toMatch(/^https:\/\/reduced.to\/.*$/);

    // Click the copy button
    await homePage.copyUrl();

    // Assert that the URL has been copied
    const clipboardData = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardData).toBe(shortenedUrl);
  });

  test('Open shortened URL in a new tab', async ({ page }) => {
    // Assert that the correct URL is opened in a new tab
    const [shortenedLinkTab] = await Promise.all([page.waitForEvent('popup'), homePage.openLinkInNewTab()]);
    await shortenedLinkTab.waitForLoadState('networkidle');

    // Check if a new tab has been opened
    const isOpened = await shortenedLinkTab.evaluate(() => !!window.opener);
    expect(isOpened).toBeTruthy(); // Expect a new tab to be opened

    // Close the new tab
    await shortenedLinkTab.close();
  });

  test('Generate shortened URL QR code', async ({ page }) => {
    // Click the `QR code` button
    await page.click('button[title="QR Code"]');

    // Assert that the QR code is displayed
    await expect(page.locator('#qrcode')).toBeVisible();
  });

  test('Share shortened URL on Twitter', async ({ page }) => {
    // Assert that the correct URL is opened in a new tab
    const redirectToTwitter = new RegExp(/https:\/\/twitter\.com\/.*\/share\?text=[^&]+&url=[^&]+&hashtags=[^&]+/);
    const [twitterTab] = await Promise.all([page.waitForEvent('popup'), homePage.shareOnTwitter()]);
    await twitterTab.waitForLoadState('networkidle');
    expect(decodeURIComponent(twitterTab.url())).toMatch(redirectToTwitter);

    // Close the new tab
    await twitterTab.close();
  });
});
