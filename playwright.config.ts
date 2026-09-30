import process from 'node:process';
import { defineConfig } from '@playwright/test';

if (process.env.LOMO_E2E_ISOLATED !== '1') {
  throw new Error('Run E2E tests with `bun run test:e2e` to use a disposable local database.');
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!siteUrl) {
  throw new Error('The isolated E2E runner must provide NEXT_PUBLIC_SITE_URL.');
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: siteUrl,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'bun --filter=@repo/lomoweb run dev',
    url: siteUrl,
    reuseExistingServer: false,
  },
});
