import { defineConfig } from '@playwright/test';

require('dotenv').config();

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
