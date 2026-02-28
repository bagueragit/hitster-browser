import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '.',
  testMatch: /e2e\.check\.spec\.js/,
  use: {
    browserName: 'chromium',
    channel: 'chrome',
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
});
