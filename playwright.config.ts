import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 45000,
  expect: { timeout: 10000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4300', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    { command: 'npm run dev -w backend', url: 'http://127.0.0.1:4301/health', reuseExistingServer: !process.env.CI, timeout: 60000 },
    { command: 'npm run dev -w frontend', url: 'http://127.0.0.1:4300', reuseExistingServer: !process.env.CI, timeout: 120000 },
  ],
});
