import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y} from 'axe-playwright'
import { AcceptCookies,LoginPortal } from '../../Helper/CommonHelper';
import { autoTestConfig } from '../../appSetting.json';

test.describe('FSS UI Home Page Accessibility Test Scenarios', () => {
  
  test.beforeEach(async ({page}) => {
    await page.goto(autoTestConfig.url)
    await AcceptCookies(page);
    await injectAxe(page)
  })

  test('check a11y for the whole page and axe run options', async ({page}) => {
    await checkA11y(page, undefined, {
      axeOptions: {
        rules: {
          'color-contrast': { enabled: false }    
        },
        runOnly: {
          type: 'tag',
          values: ['wcag2aa'],
        },
      },
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  })
 })