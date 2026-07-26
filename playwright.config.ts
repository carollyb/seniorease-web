import { defineConfig } from '@playwright/test'

export default defineConfig({
  fullyParallel: false,
  reporter: [['list']],
  testDir: './tests/e2e',
  testMatch: /.*\.e2e\.ts/,
  use: {
    baseURL: 'http://127.0.0.1:3100',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev -- --hostname 127.0.0.1 --port 3100',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: 'http://127.0.0.1:3100',
  },
  workers: 1,
})
