import { Page } from '@playwright/test';

export class HomePage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/');
  }

  async enterUrl(url: string) {
    await this.page.getByPlaceholder('Very long url...').fill(url);
  }

  async shortenUrl() {
    await this.page.getByRole('button', { name: 'Shorten URL' }).click();
  }

  async getShortenedUrl(): Promise<string | null> {
    await this.page.waitForSelector('#result');
    return await this.page.textContent('#result span');
  }

  async copyUrl() {
    await this.page.getByRole('button', { name: 'Copy' }).click();
  }

  async openLinkInNewTab() {
    await this.page.getByRole('button', { name: 'Open in new tab' }).click();
  }

  async getQRCode() {
    await this.page.getByRole('button', { name: 'QR Code' }).click();
  }

  async shareOnTwitter() {
    await this.page.getByRole('button', { name: 'Share on twitter' }).click();
  }
}
