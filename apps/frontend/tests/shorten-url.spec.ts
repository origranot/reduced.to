import { expect, test } from '@playwright/test';
import { HomePage } from './pages/home-page';

test.describe('URL Shortener App - guest mode', () => {
  let homePage: HomePage;

  // Enter a URL before testing the output options
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);

    // Go to home page
    await homePage.navigate();
    await expect(page).toHaveTitle(/The FREE Open-Source URL Shortener | Reduced.to/);

    // Enter the URL in the input field
    const inputUrl = 'google.com';
    await homePage.enterUrl(inputUrl);

    // Click the `SHORTEN URL` button
    await homePage.shortenUrl();
  });

  // test('Copy the shortened URL', async ({ page }) => {
  //   // Assert that the shortened URL is displayed correctly
  //   const shortenedUrl = await homePage.getShortenedUrl();
  //   expect(shortenedUrl).toMatch(/^https:\/\/reduced.to\/.*$/);

  //   // Click the copy button
  //   await homePage.copyUrl();

  //   // Assert that the URL has been copied
  //   const clipboardData = await page.evaluate(() => navigator.clipboard.readText());
  //   expect(clipboardData).toBe(shortenedUrl);
  // });

  test('Open shortened URL in a new tab', async ({ page }) => {
    // Assert that the correct URL is opened in a new tab
    const [shortenedLinkTab] = await Promise.all([page.waitForEvent('popup'), homePage.openLinkInNewTab()]);
    await shortenedLinkTab.waitForLoadState('networkidle');
    expect(shortenedLinkTab.url()).toContain('google.com');

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
