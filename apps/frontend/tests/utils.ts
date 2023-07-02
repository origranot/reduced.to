import { expect } from '@playwright/test';
import type { Page } from '@playwright/test/types/test';

export const toggleTheme = async (page: Page, expectedTheme: 'light' | 'dracula') => {
  await page.locator('[aria-label="Switch theme"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', expectedTheme);
};
