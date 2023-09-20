import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y} from 'axe-playwright'
import { AcceptCookies,LoginPortal } from '../../Helper/CommonHelper';
import { autoTestConfig } from '../../appSetting.json';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { commonObjectsConfig } from '../../PageObjects/commonObjects.json';

test.describe('ESS UI Landing Page Accessibility Test Scenarios', () => {
  
  test.beforeEach(async ({page}) => {
    await page.goto(autoTestConfig.url)
    await AcceptCookies(page);
    await injectAxe(page)
    await LoginPortal(page,autoTestConfig.user, autoTestConfig.password);
    await page.locator('admiralty-header').getByText('Exchange sets').click();
    await page.waitForTimeout(500);
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
