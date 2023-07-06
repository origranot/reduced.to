import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class MainPage extends BasePage {
  readonly urlInput: Locator;
  readonly linkExpDropDown: Locator;
  readonly submitButton: Locator;
  readonly shortenedLink: Locator;
  readonly copyUrlButton: Locator;
  readonly openInNewTabButton: Locator;
  readonly qrCodeButton: Locator;
  readonly shareOnTwitterButton: Locator;

  constructor(page: Page) {
    super(page, '');
    this.urlInput = this.page.locator('#urlInput');
    this.linkExpDropDown = this.page.getByRole('button', { name: '1 Week' });
    this.submitButton = this.page.getByRole('button', { name: 'Shorten URL' });
    this.shortenedLink = this.page.locator('#result');
    this.copyUrlButton = this.page.getByRole('button', { name: 'Copy' });
    this.openInNewTabButton = this.page.getByRole('button', { name: 'Open in new tab' });
    this.qrCodeButton = this.page.getByRole('button', { name: 'QR Code' });
    this.shareOnTwitterButton = this.page.getByRole('button', { name: 'Share on twitter' });
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
