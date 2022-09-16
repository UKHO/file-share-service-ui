import { test } from '@playwright/test';
import { autoTestConfig } from '../../appSetting.json';
import { LoginPortal } from '../../Helper/CommonHelper';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { commonObjectsConfig } from '../../PageObjects/commonObjects.json';
import { EssLandingPageObjects } from '../../PageObjects/essui-landingpageObjects';
import { EncSelectionPageObjects } from '../../PageObjects/essui-encselectionpageObjects';
import { EsDownloadPageObjects } from '../../PageObjects/essui-esdownloadpageObjects';
import { apiRoute400, apiRoute403, apiRoute500, apiRoute200, apiRoute200WithExcludedENCs } from './ess-api-mock';

test.describe('ESS UI ES Download Page Functional Test Scenarios', () => {

    let esslandingPageObjects: EssLandingPageObjects;
    let encSelectionPageObjects: EncSelectionPageObjects;
    let esDownloadPageObjects: EsDownloadPageObjects;

    test.beforeEach(async ({ page }) => {

        esslandingPageObjects = new EssLandingPageObjects(page);
        encSelectionPageObjects = new EncSelectionPageObjects(page);
        esDownloadPageObjects = new EsDownloadPageObjects(page);

        await page.goto(autoTestConfig.url);
        await page.waitForLoadState('load');
        await LoginPortal(page, autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await page.locator(fssHomePageObjectsConfig.essLinkSelector).click();
        await esslandingPageObjects.uploadradiobtnSelectorClick();
        await esslandingPageObjects.uploadFile(page, './Tests/TestData/test.csv');
        await esslandingPageObjects.proceedButtonSelectorClick();
        await esDownloadPageObjects.selectAllSelectorClick();
    })

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14092
    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14093
    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14094
    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14095
    test.only('Verify Estimated Size of ES & Spinner untill Download button appears', async ({ page }) => {
       
        await esDownloadPageObjects.requestENCsSelectorClick();
        await page.waitForTimeout(1000);

        // await esDownloadPageObjects.expect.spinnerSelectorVisible();
        // await esDownloadPageObjects.downloadTextSelector.waitFor({state: 'visible'});
        // await esDownloadPageObjects.expect.spinnerSelectorHidden();
       
        await esDownloadPageObjects.expect.downloadButtonSelectorEnabled();
        await esDownloadPageObjects.expect.VerifyExchangeSetSize();
    })

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14101 (Response 400 --> NOT 200 - Getting Error Message)
    test('400 scenario', async ({ page }) => {

        await apiRoute400(page);
        await esDownloadPageObjects.requestENCsSelectorClick();

        await esDownloadPageObjects.expect.errorMessageSelectorDisplayed();
    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14101 (Response 403 --> NOT 200 - Getting  Error Message)
    test('403 scenario', async ({ page }) => {

        await apiRoute403(page);
        await esDownloadPageObjects.requestENCsSelectorClick();

        await esDownloadPageObjects.expect.errorMessageSelectorDisplayed();
    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14101 (Response 500 --> NOT 200 - Getting Error Message)
    test('500 scenario', async ({ page }) => {

        await apiRoute500(page);
        await esDownloadPageObjects.requestENCsSelectorClick();

        await esDownloadPageObjects.expect.errorMessageSelectorDisplayed();
    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14129 (200 - OK)
    test('200 Scenario', async ({ page }) => {

        await encSelectionPageObjects.startAgainLinkSelectorClick();
        await esslandingPageObjects.uploadradiobtnSelectorClick();
        await esslandingPageObjects.uploadFile(page, './Tests/TestData/downloadValidENCs.csv');
        await esslandingPageObjects.proceedButtonSelectorClick();
        await esDownloadPageObjects.selectAllSelectorClick();

        await apiRoute200(page);
        await esDownloadPageObjects.requestENCsSelectorClick();
        await page.waitForTimeout(1000);

        await esDownloadPageObjects.expect.downloadButtonSelectorEnabled();
        await esDownloadPageObjects.expect.selectedTextSelectorVisible();
        await esDownloadPageObjects.expect.includedENCsCountSelectorVisible();
    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14130 (For 200 but exclude some ENCs)
    test('200 Scenario but exclude some ENCs', async ({ page }) => {

        await apiRoute200WithExcludedENCs(page);
        await esDownloadPageObjects.requestENCsSelectorClick();
        
        await esDownloadPageObjects.expect.downloadButtonSelectorEnabled();
        await esDownloadPageObjects.expect.ValidateInvalidENCsAsPerCount();
        await esDownloadPageObjects.expect.selectedTextSelectorVisible();
        await esDownloadPageObjects.expect.includedENCsCountSelectorVisible();
    });
})