import type { Locator, Page } from '@playwright/test';
import { Navbar } from './navbar.element';

export class MainPage {
  protected readonly page: Page;
  readonly navbar: Navbar;
  readonly urlInput: Locator;
  readonly linkExpDropDown: Locator;
  readonly submitButton: Locator;
  readonly shortenedLink: Locator;
  readonly copyUrlButton: Locator;
  readonly openInNewTabButton: Locator;
  readonly qrCodeButton: Locator;
  readonly qrCode: Locator;
  readonly shareOnTwitterButton: Locator;
  readonly errorMsg: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbar = new Navbar(page);
    this.urlInput = this.page.getByPlaceholder('Very long url...');
    this.linkExpDropDown = this.page.getByRole('button', { name: '1 Week' });
    this.submitButton = this.page.getByRole('button', { name: 'Shorten URL' });
    this.shortenedLink = this.page.locator('#result > span[id="text"]');
    this.copyUrlButton = this.page.getByRole('button', { name: 'Copy' });
    this.openInNewTabButton = this.page.getByRole('button', { name: 'Open in new tab' });
    this.qrCodeButton = this.page.getByRole('button', { name: 'QR Code' });
    this.qrCode = this.page.locator('#qrcode');
    this.shareOnTwitterButton = this.page.getByRole('button', { name: 'Share on twitter' });
    this.errorMsg = this.page.locator('#error');
  }

  async goto() {
    await this.page.goto('./');
  }

  async fillUrl(url: string) {
    await this.urlInput.fill(url);
  }

  async shorten() {
    await this.submitButton.click();
  }

  async getShortenedUrl(): Promise<string | null> {
    return await this.shortenedLink.textContent();
  }

  async copyUrl() {
    await this.copyUrlButton.click();
  }

  async openLinkInNewTab() {
    await this.openInNewTabButton.click();
  }

  async showQRCode() {
    await this.qrCodeButton.click();
  }

  async shareOnTwitter() {
    await this.shareOnTwitterButton.click();
  }
}
