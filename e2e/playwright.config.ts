import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173/',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        contextOptions: {
          permissions: ['clipboard-read', 'clipboard-write'],
        },
      },
    },
  ],
  webServer: [
    {
      cwd: '..',
      command: 'cd apps/backend && npm run start:dev',
      port: 3000,
      reuseExistingServer: true,
    },
    {
      cwd: '..',
      command: 'cd apps/frontend && npm run dev',
      port: 5173,
      reuseExistingServer: true,
    },
  ],
});
