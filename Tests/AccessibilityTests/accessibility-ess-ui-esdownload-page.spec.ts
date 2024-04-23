import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright'
import { AcceptCookies, LoginPortal } from '../../Helper/CommonHelper';
import { autoTestConfig } from '../../appSetting.json';
import { EssLandingPageObjects } from '../../PageObjects/essui-landingpageObjects';
import { EncSelectionPageObjects } from '../../PageObjects/essui-encselectionpageObjects';
import { ExchangeSetSelectionPageObjects } from '../../PageObjects/essui-exchangesetselectionpageObjects';


test.describe('ESS UI ENC download Page Accessibility Test Scenarios', () => {

    let esslandingPageObjects: EssLandingPageObjects;
    let encSelectionPageObjects: EncSelectionPageObjects;
    let exchangeSetSelectionPageObjects: ExchangeSetSelectionPageObjects;

    test.beforeEach(async ({ page }) => {
        esslandingPageObjects = new EssLandingPageObjects(page);
        encSelectionPageObjects = new EncSelectionPageObjects(page);
        exchangeSetSelectionPageObjects = new ExchangeSetSelectionPageObjects(page);


        await page.goto(autoTestConfig.url)
        await AcceptCookies(page);
        await injectAxe(page)
        await LoginPortal(page, autoTestConfig.user, autoTestConfig.password);
        await page.locator('admiralty-header').getByText('Exchange sets').click();
        await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
        await exchangeSetSelectionPageObjects.clickOnProceedButton();
        await esslandingPageObjects.uploadradiobtnSelectorClick();
        await esslandingPageObjects.uploadFile(page, './Tests/TestData/downloadvalidENCs.csv');
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


