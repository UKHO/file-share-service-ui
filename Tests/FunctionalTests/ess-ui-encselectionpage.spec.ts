import { test, expect } from '@playwright/test';
import { autoTestConfig } from '../../appSetting.json';
import { AcceptCookies, LoginPortal } from '../../Helper/CommonHelper';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { EssLandingPageObjects } from '../../PageObjects/essui-landingpageObjects';
import { EncSelectionPageObjects } from '../../PageObjects/essui-encselectionpageObjects';
import { ExchangeSetSelectionPageObjects } from '../../PageObjects/essui-exchangesetselectionpageObjects';

test.describe('ESS UI ENCs Selection Page Functional Test Scenarios', () => {

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
    await LoginPortal(page, autoTestConfig.user, autoTestConfig.password);
    await page.locator(fssHomePageObjectsConfig.essLinkSelector).getByText(fssHomePageObjectsConfig.essLinkText).click();
    await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    await esslandingPageObjects.uploadradiobtnSelectorClick();
    await esslandingPageObjects.uploadFile(page, './Tests/TestData/ENCs_Sorting.csv');
    await esslandingPageObjects.proceedButtonSelectorClick();
  })

  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13960
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13940
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13941
  test('Verify selecting and deselecting multiple checkboxes in left hand table, shows expected result in right hand table', async ({ page }) => {

    let encSelected = ['AU220150', 'CA271105', 'AU5PTL01']

    // To select ENCs
    await encSelectionPageObjects.expect.verifySelectedENCs(encSelected);
    //To deselect ENCs using checkbox
    await encSelectionPageObjects.expect.verifyDeselectedENCs(encSelected);
    // To deselect ENCs using "X" button.
    await encSelectionPageObjects.expect.verifyXButtonSelectorClick('AU220150');
  })

  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13961
  test('Check the functionality for Sorting of ENC numbers in ascending or descending order', async ({ page }) => {

    let ascOrderlist = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C']
    let dscOrderlist = ['GB50184C', 'CN484220', 'CA271105', 'AU5PTL01', 'AU220150']
    await encSelectionPageObjects.encNameSelectorClick();
    await encSelectionPageObjects.expect.verifyENCsSortOrder(ascOrderlist);
    await encSelectionPageObjects.encNameSelectorClick();
    await encSelectionPageObjects.expect.verifyENCsSortOrder(dscOrderlist);

  })

  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13962 (For verify Text)
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13959 (For verify Table as per ukho design)
  // https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156375
  test('Verify Text on the top of ENC list.', async ({ page }) => {
    await encSelectionPageObjects.expect.startLinkSelectorVisible();
    await encSelectionPageObjects.expect.textAboveTableSelectorToEqual("Please confirm the ENCs that you would like to include in your exchange set.If you selected “Download updates” this list will only show ENCs that have had an update within the date range provided.");
    await exchangeSetSelectionPageObjects.expect.validateHeaderText("Step 3 of 4\nConfirm exchange set content");
  })

  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13949
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13950
  test('Verify limit for selecting ENCs (i.e.100) in left hand table', async ({ page }) => {

    await encSelectionPageObjects.startAgainLinkSelectorClick();
    await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    await esslandingPageObjects.uploadradiobtnSelectorClick();
    await esslandingPageObjects.uploadFile(page, './Tests/TestData/ValidAndInvalidENCs.csv');
    await esslandingPageObjects.proceedButtonSelectorClick();
    await encSelectionPageObjects.expect.verifyRightTableRowsCountSelectorCount(100);  //rhz
  })

  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13944 (For valid ENC no.)
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13945 (For "Your selection" table)
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13946 (For "Start again" link)
  test('Verify that user is able to add a valid single ENCs and link "Start Again" redirects to ESS landing page', async ({ page }) => {
    await encSelectionPageObjects.startAgainLinkSelectorClick();
    await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    await encSelectionPageObjects.addSingleENC("DE260001");
    await encSelectionPageObjects.expect.firstEncSelectorToEqual("DE260001");
    await encSelectionPageObjects.expect.selectionTextSelectorVisible();
    await encSelectionPageObjects.startAgainLinkSelectorClick();
    await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    await esslandingPageObjects.expect.exchangesettextSelectorIsVisible();
  })

  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13954 - Add Anther ENC
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13956 - Duplicate ENC
  test('Verify that after clicking on "Add another ENC" link, user able to add another ENC number', async ({ page }) => {
    await encSelectionPageObjects.startAgainLinkSelectorClick();
    await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    let requestedCount = 0;
    encSelectionPageObjects.page.on('request', request => {
      if (request.url().includes('productInformation/productIdentifiers') && request.method() == 'POST')
        requestedCount++;
    })
    await encSelectionPageObjects.addSingleENC("DE260001");
    await encSelectionPageObjects.expect.addAnotherENCSelectorVisible();
    await encSelectionPageObjects.addAnotherENC("AU220130");  //DE290001  This is an invalid ENC so the test will fail rhz
    await encSelectionPageObjects.expect.toBeTruthy(requestedCount == 2);
    await encSelectionPageObjects.expect.secondEncSelectorContainText("AU220130"); //was DE290001
    await encSelectionPageObjects.expect.anotherCheckBoxSelectorChecked();

    //13956 - Add another ENC2 - Duplicate No.
    await encSelectionPageObjects.addAnotherENC("AU220130"); //was DE290001
    await encSelectionPageObjects.expect.errorMessageForDuplicateNumberSelectorContainsText("ENC already in list")
    await encSelectionPageObjects.expect.verifyLeftTableRowsCountSelectorCount(2);
  })

  //https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13957
  test('Verify that user is not able to add more than Maxlimit (currently configured as 250) ENCs using manually adding ENC', async ({ page }) => {
    await encSelectionPageObjects.startAgainLinkSelectorClick();
    await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    await esslandingPageObjects.uploadradiobtnSelectorClick();
    await esslandingPageObjects.uploadFile(page, './Tests/TestData/ValidAndInvalidENCs.csv');  //rhz
    await esslandingPageObjects.proceedButtonSelectorClick();
    //Adding ENC manually
    await encSelectionPageObjects.addAnotherENC("GB301191");  //rhz

    await encSelectionPageObjects.expect.errorMsgMaxLimitSelectorContainText("Max ENC limit reached");
  })

  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14112
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14113
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14114 
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14330
  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/149491
  test('Verify Count of uploaded & selected ENCs.', async ({ page }) => {
    let response = await esslandingPageObjects.page.waitForResponse(r =>
      r.url().includes('productInformation/productIdentifiers') && r.request().method() === 'POST');
    let encNames = await encSelectionPageObjects.ENCTableENClistCol1.allInnerTexts();
    let responseBody = JSON.parse((await response.body()).toString());
    await encSelectionPageObjects.expect.toBeTruthy(responseBody.productCounts.requestedProductCount == responseBody.productCounts.returnedProductCount);
    await encSelectionPageObjects.expect.toBeTruthy(encNames.length == responseBody.productCounts.returnedProductCount);
    for (let product of responseBody.products)
      await encSelectionPageObjects.expect.toBeTruthy(encNames.includes(product.productName));
    await encSelectionPageObjects.selectAllSelector.click();
    await encSelectionPageObjects.expect.verifyNumberofENCs();
    await encSelectionPageObjects.expect.toBeTruthy(!await encSelectionPageObjects.errorMessage.isVisible());
  })

  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14108
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14109
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14110
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14111 
  test('Verify Select all and Deselect all functionality', async ({ page }) => {

    // Select All link Visible bydefault
    await encSelectionPageObjects.expect.selectAllSelectorIsVisible();
    // Deselect All Visible
    await encSelectionPageObjects.selectAllSelectorClick();
    await encSelectionPageObjects.expect.deselectAllSelectorVisible();

    // Select All link Visible again
    await encSelectionPageObjects.deselectAllSelectorClick();
    await encSelectionPageObjects.expect.selectAllSelectorIsVisible();
    // Deselect All Visible when all the individual ENCs from left table selected
    const selectENCsFromTable = await encSelectionPageObjects.encTableCheckboxList;
    let numberOfENCs = await selectENCsFromTable.count();
    for (var i = 0; i < numberOfENCs; i++) {
      await selectENCsFromTable.nth(i).click();
    }
    await encSelectionPageObjects.expect.deselectAllSelectorVisible();
    // Select All link Visible when all the individual ENCs from left table de-selected
    for (var i = 0; i < numberOfENCs; i++) {
      await selectENCsFromTable.nth(i).click();
    }
    await encSelectionPageObjects.expect.selectAllSelectorIsVisible();
  })

  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14115
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14116 
  test('Verify that selecting/deselecting individual ENCs does not affect select all/deselect all link', async ({ page }) => {

    await encSelectionPageObjects.startAgainLinkSelectorClick();
    await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    await esslandingPageObjects.uploadradiobtnSelectorClick();
    await esslandingPageObjects.uploadFile(page, './Tests/TestData/100ENCs.txt');
    await esslandingPageObjects.proceedButtonSelectorClick();
    // Select All Visible & selecting individual ENCs
    await encSelectionPageObjects.firstCheckBoxSelectorClick();
    await encSelectionPageObjects.expect.selectAllSelectorIsVisible();
    // Deselect All Visible & deselecting individual ENCs
    await encSelectionPageObjects.selectAllSelectorClick();
    await encSelectionPageObjects.firstCheckBoxSelectorClick();
    await encSelectionPageObjects.expect.deselectAllSelectorVisible();

  })

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/149492
  test('Verify Message when invalid ENCs found for Base Exchange Set type', async ({ page }) => {
    await encSelectionPageObjects.startAgainLinkSelectorClick();
    await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    await esslandingPageObjects.uploadradiobtnSelectorClick();
    await esslandingPageObjects.uploadFile(page, './Tests/TestData/downloadValidAndInvalidENCs.csv');
    await esslandingPageObjects.proceedButtonSelectorClick();
    await esslandingPageObjects.page.waitForResponse(r =>
      r.url().includes('productInformation/productIdentifiers') && r.request().method() === 'POST')
    await encSelectionPageObjects.errorMessage.click();
    // rhz
    var actualErrorMessage = await encSelectionPageObjects.errorMessage.innerText();
    //await encSelectionPageObjects.expect.toBeTruthy(await encSelectionPageObjects.errorMessage.innerText() == "Invalid cells - GZ800112");
    await encSelectionPageObjects.expect.toBeTruthy(actualErrorMessage.includes("Invalid cells"));
    await encSelectionPageObjects.expect.toBeTruthy(actualErrorMessage.includes("GZ800112"));
  })

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/150972
  test('Verify validation message for Excluded AIO cell', async ({ page }) => {
    var message = "AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site";
    await encSelectionPageObjects.page.waitForLoadState();
    await encSelectionPageObjects.startAgainLinkSelectorClick();
    await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    await encSelectionPageObjects.addSingleENC("GB800002");
    await encSelectionPageObjects.errorMessage.click();
    await encSelectionPageObjects.expect.toBeTruthy(message == await encSelectionPageObjects.errorMessage.innerText());
    await encSelectionPageObjects.addSingleENC("DE260001");
    await encSelectionPageObjects.addAnotherENC("GB800002");
    await encSelectionPageObjects.errorMessage.click();
    await encSelectionPageObjects.expect.toBeTruthy(message == await encSelectionPageObjects.errorMessage.innerText());
  })

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/149494
  test('Verify estimated file size of selected ENC cells for Base Exchange Set type', async ({ page }) => {
    var response = await esslandingPageObjects.page.waitForResponse(response => response.url().includes('productInformation/productIdentifiers') && response.request().method() === 'POST');
    var responseBody = JSON.parse(await response.text());
    let fileSize = await encSelectionPageObjects.getFileSize(await response.text());
    const selectENCsFromTable = encSelectionPageObjects.encTableCheckboxList;
    await encSelectionPageObjects.selectAllSelectorClick();
    await encSelectionPageObjects.deselectAllSelector.isVisible();
    var estimatedSize = await encSelectionPageObjects.exchangeSetSizeSelector.innerText();
    await encSelectionPageObjects.expect.toBeTruthy(fileSize + ' MB' == estimatedSize);
    let itemIndex = 0;
    await selectENCsFromTable.nth(itemIndex).click();
    //fileSize -= parseFloat((responseBody.products[0].fileSize / 1048576).toFixed(2)); rhz new method call on following line
    let newFileSize = (await encSelectionPageObjects.getFileSizeItemRemoved(await response.text(),itemIndex));
    var estimatedSize = await encSelectionPageObjects.exchangeSetSizeSelector.innerText();
    await encSelectionPageObjects.expect.toBeTruthy(newFileSize + ' MB' == estimatedSize);
  })

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/151757
  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/151271
  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/151339
  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/151474
  test('Verify estimated file size of selected ENC cells for Delta Exchange Set type', async ({ page }) => {
    await encSelectionPageObjects.startAgainLinkSelectorClick();
    await exchangeSetSelectionPageObjects.enterDate(new Date());
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    await esslandingPageObjects.uploadradiobtnSelectorClick();
    await esslandingPageObjects.uploadFile(page, './Tests/TestData/Delta.csv');
    await esslandingPageObjects.proceedButtonSelectorClick();
    var productIdentifierResponse = await esslandingPageObjects.page.waitForResponse(response => response.url().includes('productInformation/productIdentifiers') && response.request().method() === 'POST');
    var sinceDateResponse = await esslandingPageObjects.page.waitForResponse(response => response.url().includes('ProductInformation?sinceDateTime=') && response.request().method() == 'GET');
    var expectedEncs = await encSelectionPageObjects.getCommonEncs(await productIdentifierResponse.text(), await sinceDateResponse.text());
    let fileSize = await encSelectionPageObjects.getFileSizeForDelta(await sinceDateResponse.text(), expectedEncs);
    const actualEncs = new Set(await encSelectionPageObjects.encNames.allInnerTexts());
    await encSelectionPageObjects.expect.toBeTruthy(expectedEncs.every(r => actualEncs.has(r)));
    await encSelectionPageObjects.selectAllSelectorClick();
    var estimatedSize = await encSelectionPageObjects.exchangeSetSizeSelector.innerText();
    await encSelectionPageObjects.expect.toBeTruthy(fileSize + ' MB' == estimatedSize);
    await encSelectionPageObjects.encTableCheckboxList.nth(0).click();
    var firstEncName = (await encSelectionPageObjects.encNames.first().innerText());
    fileSize = await encSelectionPageObjects.getFileSizeForDelta(await sinceDateResponse.text(), expectedEncs.filter(r => r != firstEncName));
    estimatedSize = await encSelectionPageObjects.exchangeSetSizeSelector.innerText();
    await encSelectionPageObjects.expect.toBeTruthy(fileSize + ' MB' == estimatedSize);
    await encSelectionPageObjects.deselectAllSelectorClick();
    await encSelectionPageObjects.selectAllSelectorClick();
    await encSelectionPageObjects.requestENCsSelectorClick();
    var productVersionResponse = await encSelectionPageObjects.page.waitForResponse(r => r.url().includes('productData/productVersions') && r.request().method() == 'POST');
    await esslandingPageObjects.expect.IsNotEmpty(productVersionResponse.url());
    var batchResponse = await encSelectionPageObjects.page.waitForResponse(r => r.url().includes('api/batch') && r.url().includes('/status') && r.request().method() == 'GET');
    await esslandingPageObjects.expect.IsNotEmpty(batchResponse.url());
    await encSelectionPageObjects.expect.ValidateProductVersionPayload(await sinceDateResponse.text(), productVersionResponse.request().postData());
  })

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156059
  test("check UKHO user is able to see options to choose preferred exchange set format on 'Confirm exchange set content​' screen for base exchange set.",async ({ page}) =>{
    await encSelectionPageObjects.selectAllSelectorClick();
    encSelectionPageObjects.expect.toBeTruthy(await encSelectionPageObjects.s63Radiobutton.isVisible());
    encSelectionPageObjects.expect.toBeTruthy(await encSelectionPageObjects.s57Radiobutton.isVisible());
    encSelectionPageObjects.expect.toBeTruthy(await encSelectionPageObjects.s63Radiobutton.isChecked());
    encSelectionPageObjects.expect.toBeTruthy((await encSelectionPageObjects.s63Radiobutton.innerText()).trim() == "S63 exchange set");
    encSelectionPageObjects.expect.toBeTruthy((await encSelectionPageObjects.s57Radiobutton.innerText()).trim() == "S57 exchange set");
  });

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156211
  test("check UKHO user is able to see options to choose preferred exchange set format on 'Confirm exchange set content​' screen for Delta exchange set.",async ({ page}) =>{
    await encSelectionPageObjects.startAgainLinkSelectorClick();
    await exchangeSetSelectionPageObjects.enterDate(new Date());
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    await esslandingPageObjects.uploadradiobtnSelectorClick();
    await esslandingPageObjects.uploadFile(page, './Tests/TestData/Delta.csv');
    await esslandingPageObjects.proceedButtonSelectorClick(); 
    await encSelectionPageObjects.selectAllSelectorClick();
    encSelectionPageObjects.expect.toBeTruthy(await encSelectionPageObjects.s63Radiobutton.isVisible());
    encSelectionPageObjects.expect.toBeTruthy(await encSelectionPageObjects.s57Radiobutton.isVisible());
    encSelectionPageObjects.expect.toBeTruthy(await encSelectionPageObjects.s63Radiobutton.isChecked());
    encSelectionPageObjects.expect.toBeTruthy(await encSelectionPageObjects.s63Radiobutton.innerText() == "S63 exchange set");
    encSelectionPageObjects.expect.toBeTruthy(await encSelectionPageObjects.s57Radiobutton.innerText() == "S57 exchange set");
  });

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156231
  test("Check Estimated size is visible for S63 exchange set when user select base exchange set type", async ({ page }) => {
    await encSelectionPageObjects.startAgainLinkSelectorClick();
    await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    await esslandingPageObjects.uploadradiobtnSelectorClick();
    await esslandingPageObjects.uploadFile(page, './Tests/TestData/250ENCs.csv');
    await esslandingPageObjects.proceedButtonSelectorClick();
    await page.waitForSelector("input[type='checkbox']:nth-child(1)", { state: "visible", timeout: 3000});
    const selectENCsFromTable = encSelectionPageObjects.encTableCheckboxList;
    await selectENCsFromTable.nth(0).click();
    for (var i=1; !await encSelectionPageObjects.selectedEncs.evaluate(element => element.scrollHeight > element.clientHeight); i++) {
      await selectENCsFromTable.nth(i).click();
    }
    encSelectionPageObjects.expect.toBeTruthy(await encSelectionPageObjects.selectedEncs.evaluate(element => element.scrollHeight > element.clientHeight));
  });
});
