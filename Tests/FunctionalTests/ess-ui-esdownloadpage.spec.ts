import { test } from '@playwright/test';
import { autoTestConfig } from '../../appSetting.json';
import { AcceptCookies, LoginPortal } from '../../Helper/CommonHelper';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { EssLandingPageObjects } from '../../PageObjects/essui-landingpageObjects';
import { EncSelectionPageObjects } from '../../PageObjects/essui-encselectionpageObjects';
import { EsDownloadPageObjects } from '../../PageObjects/essui-esdownloadpageObjects';
import { apiRoute400, apiRoute403, apiRoute500, apiRoute200, apiRoute200WithExcludedENCs } from '../../PageObjects/ess-api-mock';
import { ExchangeSetSelectionPageObjects } from '../../PageObjects/essui-exchangesetselectionpageObjects';

test.describe('ESS UI ES Download Page Functional Test Scenarios', () => {

    let esslandingPageObjects: EssLandingPageObjects;
    let encSelectionPageObjects: EncSelectionPageObjects;
    let esDownloadPageObjects: EsDownloadPageObjects;
    let exchangeSetSelectionPageObjects: ExchangeSetSelectionPageObjects;
    let fileSize: number;

    test.beforeEach(async ({ page }) => {

        esslandingPageObjects = new EssLandingPageObjects(page);
        encSelectionPageObjects = new EncSelectionPageObjects(page);
        esDownloadPageObjects = new EsDownloadPageObjects(page);
        exchangeSetSelectionPageObjects = new ExchangeSetSelectionPageObjects(page);
        await page.goto(autoTestConfig.url);
        await page.waitForLoadState('load');
        await AcceptCookies(page);
        await LoginPortal(page, autoTestConfig.user, autoTestConfig.password);
        await page.locator(fssHomePageObjectsConfig.essLinkSelector).getByText(fssHomePageObjectsConfig.essLinkText).click();
        await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
        await exchangeSetSelectionPageObjects.clickOnProceedButton();
        await esslandingPageObjects.uploadradiobtnSelectorClick();
        await esslandingPageObjects.uploadFile(page, './Tests/TestData/downloadvalidENCs.csv');
        await esslandingPageObjects.proceedButtonSelectorClick();
    })

    //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156096
    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14092
    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14093
    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14094
    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14095
    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14239 
    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14330
    // https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156018
    // https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156119
    test('Verify Estimated Size of ES, Number of ENCs Selected, Spinner, Download button and downloaded zip file from Download page', async ({ page }) => {

        var response = await esslandingPageObjects.page.waitForResponse(response => response.url().includes('productInformation/productIdentifiers') && response.request().method() === 'POST');
        fileSize = await encSelectionPageObjects.getFileSize(await response.text());
        await encSelectionPageObjects.selectAllSelectorClick();
        encSelectionPageObjects.SelectedENCsCount();
        let estimatedString = await encSelectionPageObjects.exchangeSetSizeSelector.innerText();
        await encSelectionPageObjects.requestENCsSelectorClick();
        var request = await page.waitForResponse(response => response.url().includes("/productData/productIdentifiers") && response.request().method() == "POST");
        await encSelectionPageObjects.expect.toBeTruthy(request.url().includes("exchangeSetStandard=S63"));
        await encSelectionPageObjects.page.waitForLoadState();
        await esDownloadPageObjects.expect.downloadButtonSelectorHidden();
        await esDownloadPageObjects.expect.spinnerSelectorVisible();
        await esDownloadPageObjects.downloadButtonSelector.waitFor({ state: 'visible' });
        await esDownloadPageObjects.expect.spinnerSelectorHidden();
        await esDownloadPageObjects.expect.downloadButtonSelectorEnabled();
        await esDownloadPageObjects.expect.exchangeSetDownloadGridValidation();
        //=========================================


        esDownloadPageObjects.expect.VerifyExchangeSetSizeIsValid(estimatedString, fileSize);
        await esDownloadPageObjects.expect.downloadLinkSelectorHidden();
        await esDownloadPageObjects.expect.createLinkSelectorHidden();

        //=========================================
        await esDownloadPageObjects.downloadFile(page, './Tests/TestData/DownloadFile/ExchangeSet.zip');
        await esDownloadPageObjects.expect.ValidateFileDownloaded("./Tests/TestData/DownloadFile/ExchangeSet.zip");
        await esDownloadPageObjects.expect.ValidateFiledeleted("./Tests/TestData/DownloadFile/ExchangeSet.zip");
        await esDownloadPageObjects.expect.downloadLinkSelectorEnabled();
        await esDownloadPageObjects.expect.createLinkSelectorEnabled();
        await esDownloadPageObjects.expect.exchangeSetDownloadGridValidation();
        await exchangeSetSelectionPageObjects.expect.validateHeaderText("Step 4 of 4\nExchange set creation");
    })

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156097
    // Disabled - S57 not available at the moment Rhz
    //test('check user is able to download S57 exchange set for base exchange set', async ({ page }) => {
    //    await encSelectionPageObjects.startAgainLinkSelectorClick();
    //    await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
    //    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    //    await encSelectionPageObjects.addSingleENC("DE260001");
    //    await encSelectionPageObjects.selectAllSelectorClick();
    //    await encSelectionPageObjects.s57Radiobutton.click();
    //    await encSelectionPageObjects.requestENCsSelectorClick();
    //    var response = await page.waitForResponse(response => response.url().includes("/productData/productIdentifiers") && response.request().method() == "POST");
    //    await encSelectionPageObjects.expect.toBeTruthy(response.url().includes("exchangeSetStandard=S57"));
    //    await encSelectionPageObjects.page.waitForLoadState();
    //    await esDownloadPageObjects.expect.downloadButtonSelectorHidden();
    //    await esDownloadPageObjects.expect.spinnerSelectorVisible();
    //    await esDownloadPageObjects.downloadButtonSelector.waitFor({state: 'visible'});
    //    await esDownloadPageObjects.expect.spinnerSelectorHidden();       
    //    await esDownloadPageObjects.expect.downloadButtonSelectorEnabled();
    //    await esDownloadPageObjects.expect.exchangeSetDownloadGridValidation();
    //    //=========================================
        
    //    await esDownloadPageObjects.expect.downloadLinkSelectorHidden();
    //    await esDownloadPageObjects.expect.createLinkSelectorHidden();

    //    //=========================================
    //    await esDownloadPageObjects.downloadFile(page, './Tests/TestData/DownloadFile/ExchangeSet.zip');
    //    await esDownloadPageObjects.expect.ValidateFileDownloaded("./Tests/TestData/DownloadFile/ExchangeSet.zip");
    //    await esDownloadPageObjects.expect.ValidateFiledeleted("./Tests/TestData/DownloadFile/ExchangeSet.zip");
    //    await esDownloadPageObjects.expect.downloadLinkSelectorEnabled();
    //    await esDownloadPageObjects.expect.createLinkSelectorEnabled();
    //});

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156248
    

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156352
     

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14101
    test('Verify 400 scenario using playwright mock', async ({ page }) => {

        await encSelectionPageObjects.selectAllSelectorClick();
        await apiRoute400(page);
        await encSelectionPageObjects.requestENCsSelectorClick();
        await esDownloadPageObjects.expect.errorMessageSelectorDisplayed();
    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14101 
    test('Verify 403 scenario using playwright mock', async ({ page }) => {

        await encSelectionPageObjects.selectAllSelectorClick();
        await apiRoute403(page);
        await encSelectionPageObjects.requestENCsSelectorClick();
        await esDownloadPageObjects.expect.errorMessageSelectorDisplayed();
    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14101
    test('Verify 500 scenario using playwright mock', async ({ page }) => {

        await encSelectionPageObjects.selectAllSelectorClick();
        await apiRoute500(page);
        await encSelectionPageObjects.requestENCsSelectorClick();
        await esDownloadPageObjects.expect.errorMessageSelectorDisplayed();
    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14129
    test('Verify 200 scenario using playwright mock when all selected ENCs are included in ES', async ({ page }) => {

        await encSelectionPageObjects.startAgainLinkSelectorClick();
        await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
        await exchangeSetSelectionPageObjects.clickOnProceedButton();
        await esslandingPageObjects.uploadradiobtnSelectorClick();
        await esslandingPageObjects.uploadFile(page, './Tests/TestData/downloadValidENCs.csv');
        await esslandingPageObjects.proceedButtonSelectorClick();
        await encSelectionPageObjects.selectAllSelectorClick();
        await apiRoute200(page);
        await encSelectionPageObjects.requestENCsSelectorClick();
        await esDownloadPageObjects.expect.downloadButtonSelectorEnabled();
        await esDownloadPageObjects.expect.selectedTextSelectorVisible();
        await esDownloadPageObjects.expect.includedENCsCountSelectorVisible();
    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14130 
    test('Verify 200 scenario using playwright mock when all selected ENCs are not included in ES', async ({ page }) => {

        await encSelectionPageObjects.selectAllSelectorClick();
        let invalidENCs = ['AU220150', 'AU5PTL01', 'GB123456']
        await apiRoute200WithExcludedENCs(page);
        await encSelectionPageObjects.requestENCsSelectorClick();
        await esDownloadPageObjects.expect.downloadButtonSelectorEnabled();
        await esDownloadPageObjects.expect.ValidateInvalidENCsAsPerCount(invalidENCs);
        await esDownloadPageObjects.expect.selectedTextSelectorVisible();
        await esDownloadPageObjects.expect.includedENCsCountSelectorVisible();
    });

    //// https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14316
    
})
