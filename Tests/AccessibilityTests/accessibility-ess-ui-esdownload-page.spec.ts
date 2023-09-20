import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright'
import { AcceptCookies, LoginPortal } from '../../Helper/CommonHelper';
import { autoTestConfig } from '../../appSetting.json';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { commonObjectsConfig } from '../../PageObjects/commonObjects.json';
import { EssLandingPageObjects } from '../../PageObjects/essui-landingpageObjects';
import { EncSelectionPageObjects } from '../../PageObjects/essui-encselectionpageObjects';

test.describe('ESS UI ENC download Page Accessibility Test Scenarios', () => {

    let esslandingPageObjects: EssLandingPageObjects;
    let encSelectionPageObjects: EncSelectionPageObjects;

    test.beforeEach(async ({ page }) => {
        esslandingPageObjects = new EssLandingPageObjects(page);
        encSelectionPageObjects = new EncSelectionPageObjects(page);

        await page.goto(autoTestConfig.url)
        await AcceptCookies(page);
        await injectAxe(page)
        await LoginPortal(page, autoTestConfig.user, autoTestConfig.password);
        await page.locator('admiralty-header').getByText('Exchange sets').click();
        await esslandingPageObjects.uploadradiobtnSelectorClick();
        await esslandingPageObjects.uploadFile(page, './Tests/TestData/ENCs_Sorting.csv');
        await esslandingPageObjects.proceedButtonSelectorClick();
        await encSelectionPageObjects.selectAllSelectorClick();
        await encSelectionPageObjects.requestENCsSelectorClick();
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


