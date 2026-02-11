import { defineConfig } from '@playwright/test';

export default defineConfig({

    globalSetup: './global-setup.ts',
  use: {
    baseURL: 'https://www.saucedemo.com',
    storageState: 'storageState.json',
  },

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
],
});
