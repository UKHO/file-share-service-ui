import { test, expect } from '@playwright/test';
import { esslandingpageObjectsConfig } from '../../PageObjects/essui-landingpageObjects.json';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { uploadFile, } from '../../Helper/ESSLandingPageHelper';
import { autoTestConfig } from '../../appSetting.json';
import { LoginPortal } from '../../Helper/CommonHelper';
import { commonObjectsConfig } from '../../PageObjects/commonObjects.json';
import { downloadpageObjectsConfig } from '../../PageObjects/essui-esdownloadpageObjects.json'

test.describe('ESS UI ES Download Page Functional Test Scenarios', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(autoTestConfig.url);
        await page.waitForLoadState('load');
        await LoginPortal(page, autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await page.locator(fssHomePageObjectsConfig.essLinkSelector).click();
        await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
        await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData/ValidENCs.csv');
        await page.click(esslandingpageObjectsConfig.proceedButtonSelector);
    })

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14092
    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14093
    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14094
    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14095
    test('Verify Estimated Size of ES & Spinner untill Download button appears', async ({ page }) => {
        await page.click(downloadpageObjectsConfig.selectAllSelector);
        await page.click(downloadpageObjectsConfig.requestENCsSelector);
        await expect(page.locator(downloadpageObjectsConfig.spinnerSelector)).toBeVisible();
        await page.waitForSelector(downloadpageObjectsConfig.downloadButtonSelector);
        await expect(page.locator(downloadpageObjectsConfig.spinnerSelector)).toBeHidden();
        await expect(page.locator(downloadpageObjectsConfig.downloadButtonSelector)).toBeVisible();

        let ENCsIncluded = parseInt(((await page.innerHTML(downloadpageObjectsConfig.IncludedENCsCountSelector)).split(' '))[0]);
        if (ENCsIncluded < 3) {
            await expect(page.locator(downloadpageObjectsConfig.EstimatedESsizeSelector)).toContainText('Estimated size ' + Math.round(ENCsIncluded * (0.3) * 1024) + 'KB');
        }
        else {
            await expect(page.locator(downloadpageObjectsConfig.EstimatedESsizeSelector)).toContainText('Estimated size ' + ENCsIncluded * (0.3) + 'MB');
        }



    })
})