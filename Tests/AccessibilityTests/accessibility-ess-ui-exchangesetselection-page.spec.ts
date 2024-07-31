import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright'
import { autoTestConfig } from '../../appSetting.json';
import { AcceptCookies, LoginPortal } from '../../Helper/CommonHelper';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { EssLandingPageObjects } from '../../PageObjects/essui-landingpageObjects';
import { EncSelectionPageObjects } from '../../PageObjects/essui-encselectionpageObjects';
import { ExchangeSetSelectionPageObjects } from '../../PageObjects/essui-exchangesetselectionpageObjects';

test.describe('ESS UI Exchange Set Type Selection Page Accessibility Test Scenarios', () => {
    let esslandingPageObjects: EssLandingPageObjects;
    let encSelectionPageObjects: EncSelectionPageObjects;
    let exchangeSetSelectionPageObjects: ExchangeSetSelectionPageObjects;

    test.beforeEach(async ({ page }) => {
        esslandingPageObjects = new EssLandingPageObjects(page);
        encSelectionPageObjects = new EncSelectionPageObjects(page);
        exchangeSetSelectionPageObjects = new ExchangeSetSelectionPageObjects(page);
        await page.goto(autoTestConfig.url);
        await page.waitForLoadState('load');
        await AcceptCookies(page);
        await injectAxe(page)
        await LoginPortal(page, autoTestConfig.user, autoTestConfig.password);
        await page.locator(fssHomePageObjectsConfig.essLinkSelector).getByText(fssHomePageObjectsConfig.essLinkText).click();
        await exchangeSetSelectionPageObjects.enterDate(new Date());
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

