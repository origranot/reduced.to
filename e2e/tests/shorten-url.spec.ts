import { expect, test } from './fixtures';
import { routes } from './helpers/constants';
import { invalidURL, validURL } from './helpers/faker-utils';

test.describe('URL Shortener App', () => {
  test.beforeEach(async ({ page, mainPage }) => {
    await mainPage.fillUrl(validURL());
    await mainPage.shorten();

    const response = await page.waitForResponse(routes.SHORTEN_URL);
    const jsonResponse = await response.json();

    expect(response.status()).toBe(201);
    expect(jsonResponse.newUrl).toBeTruthy();
  });

  test('Copy the shortened URL', async ({ page, mainPage }) => {
    await expect(mainPage.shortenedLink).toBeVisible();
    await mainPage.copyUrl();

    const shortenedUrl = await mainPage.getShortenedUrl();
    const clipboardData = await page.evaluate(() => navigator.clipboard.readText());

    // Assert that the URL has been copied
    expect(clipboardData).toBe(shortenedUrl);
  });

  test('Open shortened URL in a new tab', async ({ page, mainPage, context }) => {
    const [shortenedLinkTab] = await Promise.all([page.waitForEvent('popup'), mainPage.openLinkInNewTab()]);
    await shortenedLinkTab.waitForLoadState('networkidle');
    const pages = context.pages();
    expect(pages.length).toBeGreaterThan(1);
  });

  test('Show shortened URL QR code', async ({ mainPage }) => {
    await mainPage.showQRCode();
    await expect(mainPage.qrCode).toBeVisible();
  });

  test('Share shortened URL on Twitter', async ({ page, mainPage }) => {
    const shareOnTwitterLinkPattern = new RegExp(/https:\/\/twitter\.com\/.*\/share\?text=[^&]+&url=[^&]+&hashtags=[^&]+/);
    const [twitterTab] = await Promise.all([page.waitForEvent('popup'), mainPage.shareOnTwitter()]);
    const decodedUrl = decodeURIComponent(twitterTab.url());
    expect(decodedUrl).toMatch(shareOnTwitterLinkPattern);
  });
});

test.describe('Invalid input URL', () => {
  test('Should raise an error', async ({ page, mainPage }) => {
    await mainPage.fillUrl(invalidURL());
    await mainPage.shorten();

    const response = await page.waitForResponse(routes.SHORTEN_URL);
    const jsonResponse = await response.json();

    expect(response.status()).toBe(400);
    expect(jsonResponse.newUrl).toBeUndefined();
    await expect(mainPage.errorMsg).toBeVisible();
  });
});
