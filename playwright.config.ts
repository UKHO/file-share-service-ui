import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import { autoTestConfig } from './appSetting.json';

const config: PlaywrightTestConfig = {
  
  retries: 3,
  testDir: './Tests',
  /* Maximum time one test can run for. */
  timeout: 100 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 8000
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
   
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['junit', { outputFile: 'junit.xml' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    actionTimeout: 100 * 1000,
    navigationTimeout: 150 * 1000,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
     name: 'chromium',
     use: {
       ...devices['Desktop Chrome'],
     },
    },
//// Note: Flaky Tests in pipeline, so commenting below browsers for now. Discussed & agreed with Ravi.
    //  {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //   },
    // },

    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //   },
    // },

    //{
    //  name: 'Microsoft Edge',
    // use: {
    //    channel: 'msedge'
     //  }
    //}
   
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
};

export default config;
