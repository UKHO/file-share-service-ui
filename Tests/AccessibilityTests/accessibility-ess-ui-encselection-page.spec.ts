import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright'
import { AcceptCookies, LoginPortal } from '../../Helper/CommonHelper';
import { autoTestConfig } from '../../appSetting.json';
import { EssLandingPageObjects } from '../../PageObjects/essui-landingpageObjects';

test.describe('ESS UI ENC Selection Page Accessibility Test Scenarios', () => {

    let esslandingPageObjects: EssLandingPageObjects;

    test.beforeEach(async ({ page }) => {
        esslandingPageObjects = new EssLandingPageObjects(page);
        await page.goto(autoTestConfig.url)
        await AcceptCookies(page);
        await injectAxe(page)
        await LoginPortal(page, autoTestConfig.user, autoTestConfig.password);
        await page.locator('admiralty-header').getByText('Exchange sets').click();
        await esslandingPageObjects.uploadradiobtnSelectorClick();
        await esslandingPageObjects.uploadFile(page, './Tests/TestData/ENCs_Sorting.csv');
        await esslandingPageObjects.proceedButtonSelectorClick();
    })

    test('check a11y for the whole page and axe run options', async ({ page }) => {
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
