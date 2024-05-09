import { test, expect } from '@playwright/test';
import { EssLandingPageObjects } from '../../PageObjects/essui-landingpageObjects';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { autoTestConfig } from '../../appSetting.json';
import { AcceptCookies, LoginPortal } from '../../Helper/CommonHelper';
import { EncSelectionPageObjects } from '../../PageObjects/essui-encselectionpageObjects';
import { ExchangeSetSelectionPageObjects } from '../../PageObjects/essui-exchangesetselectionpageObjects';

test.describe('ESS UI Landing Page Functional Test Scenarios', () => {

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
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13806
     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14421
     test('Verify Radio buttons text on ESS landing page', async ({ page }) => {
          const headLabel = page.locator("h1#main");
          const radio1 = page.getByRole('radio', { name: "Upload a list in a file" });
          const radio2 = page.getByRole('radio', { name: "Add ENC" });
          await expect(radio1).toBeTruthy();
          await expect(radio2).toBeTruthy();

     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13799
     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14422
     test('Verify clicking on First Radio Button, "click to choose a file" control and "Proceed" button available And also verify Max ENC upload limit & Max Selected ENC limit', async ({ page }) => {
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.expect.chooseuploadfileoptionSelectorIsVisible();
          await esslandingPageObjects.expect.chooseuploadfileproceedSelectorIsVisible();
          await esslandingPageObjects.expect.VerifyMaxENCLimit();
          await esslandingPageObjects.expect.VerifyMaxSelectedENCLimit();
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13799 
     test('Verify clicking on Second Radio Button, "Select single ENCs" control & "Proceed" button available', async ({ page }) => {
          await esslandingPageObjects.addencradiobtnSelectorClick();
          await esslandingPageObjects.expect.addsingleencSelectorIsVisible();
          await esslandingPageObjects.expect.proceedButtonSelectorIsVisible();
     })

     //https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13809
     //https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14102
     //https://dev.azure.com/ukhydro/ENC%20Publishing/_workitems/edit/61807          
     test('Verify all the uploaded ENCs from .csv file, displayed on the screen', async ({ page }) => {
          let enclist = ['AU220150', 'CN484220', 'GB50184C', 'CA271105', 'AU5PTL01']
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/ValidENCs.csv');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await esslandingPageObjects.page.waitForResponse(response => response.url().includes('productInformation/productIdentifiers') && response.request().method() === 'POST');
          await esslandingPageObjects.expect.verifyUploadedENCs(enclist);
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13815
     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14103 
     //https://dev.azure.com/ukhydro/ENC%20Publishing/_workitems/edit/61807            
     test('Verify all the uploaded ENCs from .txt file, displayed on the screen', async ({ page }) => {
          let enclist = ["AU220150", "CN484220", "GB50184C", "CA271105", "AU5PTL01"];
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/ValidENCs.txt');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await esslandingPageObjects.page.waitForResponse(response => response.url().includes('productInformation/productIdentifiers') && response.request().method() === 'POST');
          await esslandingPageObjects.expect.verifyUploadedENCs(enclist);
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13810 
     test('Verify an error message if user tries to upload other than allowed files', async ({ page }) => {

          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/FileOtherThanCSVorTXT.xlsx');
          await esslandingPageObjects.expect.errorMessageSelectorContainText('Please select a .csv or .txt file');

     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13811
     test('Upload CSV file with valid & invalid ENCs and verify ENC uploaded', async ({ page }) => {

          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/validAndInvalidENCs.csv');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await esslandingPageObjects.expect.VerifyExcludedENCsMessage("Some values have not been added to list.");
          await esslandingPageObjects.expect.uploadedDataSelectorToBeEqual("AU210130");
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13817
     test('Upload TXT file with valid & invalid ENCs and verify ENC uploaded', async ({ page }) => {

          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/ValidAndInvalidENCs.txt');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await esslandingPageObjects.expect.VerifyExcludedENCsMessage("Some values have not been added to list.");
          await esslandingPageObjects.expect.uploadedDataSelectorToBeEqual("AU210130");
     })

     //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/149496
     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13823
     test('Verify uploading valid, invalid & valid duplicate ENC Numbers in CSV File, upload only once.', async ({ page }) => {
          let enclist = ['AU220150', 'CN484220', 'CA271105', 'AU5PTL01'];
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/validAndDuplicateENCs.csv');
          await esslandingPageObjects.proceedButtonSelectorClick();
          const requestPromise = await esslandingPageObjects.page.waitForResponse(r =>
               r.url().includes('productInformation/productIdentifiers') && r.request().method() === 'POST')
          await esslandingPageObjects.expect.IsNotEmpty(requestPromise.url());
          await esslandingPageObjects.expect.VerifyExcludedENCsMessage("Some values have not been added to list.");
          await esslandingPageObjects.expect.verifyUploadedENCs(enclist);
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13826
     test('Verify uploading valid, invalid & valid duplicate ENC Numbers in TXT File, upload only valid and once.', async ({ page }) => {
          let enclist = ['AU220150', 'CN484220', 'CA271105', 'AU5PTL01']
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData//ValidAndDuplicateENCs.txt');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await esslandingPageObjects.page.waitForResponse(response => response.url().includes('productInformation/productIdentifiers') && response.request().method() === 'POST');
          await esslandingPageObjects.expect.VerifyExcludedENCsMessage("Some values have not been added to list.");
          await esslandingPageObjects.expect.verifyUploadedENCs(enclist);
     })

     // https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156780
     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13944
     // https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/149492
     test('Verify that error displays when user enters invalid single ENC', async ({ page }) => {

          await esslandingPageObjects.addencradiobtnSelectorClick();
          await esslandingPageObjects.setaddSingleENCTextboxSelector("A1720150");
          await esslandingPageObjects.proceedButtonSelectorClick();
          await encSelectionPageObjects.expect.toBeTruthy(await esslandingPageObjects.messageType.getAttribute("icon-name") == "exclamation");
          await esslandingPageObjects.expect.errorMessageForInvalidENCSelectorContainText("Invalid ENC number");
          let backgroundColour = await encSelectionPageObjects.messageBackground.evaluate(element => window.getComputedStyle(element).getPropertyValue("background-color"));
          await encSelectionPageObjects.expect.toBeTruthy(backgroundColour == "rgb(247, 225, 225)");
          await esslandingPageObjects.addencradiobtnSelectorClick();
          await esslandingPageObjects.setaddSingleENCTextboxSelector("DE360010");
          await esslandingPageObjects.proceedButtonSelectorClick();
          await page.waitForLoadState();
          await encSelectionPageObjects.addAnotherENC("GZ800112");
          await encSelectionPageObjects.expect.toBeTruthy(await esslandingPageObjects.messageType.getAttribute("icon-name") == "exclamation");
          await encSelectionPageObjects.expect.toBeTruthy((await encSelectionPageObjects.errorMessage.innerText()).trim() == "Invalid ENC number");
          backgroundColour = await encSelectionPageObjects.messageBackground.evaluate(element => window.getComputedStyle(element).getPropertyValue("background-color"));
          await encSelectionPageObjects.expect.toBeTruthy(backgroundColour == "rgb(247, 225, 225)");
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14332
     test('Verify that the user is able to drag a .csv and .text file.', async ({ page }) => {

          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.DragDropFile(page, './Tests/TestData/ValidAndInvalidENCs.csv', "ValidAndInvalidENCs.csv", 'text/csv');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await encSelectionPageObjects.startAgainLinkSelectorClick();
          await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
          await exchangeSetSelectionPageObjects.clickOnProceedButton();
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.DragDropFile(page, './Tests/TestData/ValidAndInvalidENCs.txt', 'ValidAndInvalidENCs.txt', 'text/plain');
          await esslandingPageObjects.expect.verifyDraggedFile("ValidAndInvalidENCs.txt");
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14333s
     test('Verify a error message if user tries to drag other than allowed files.', async ({ page }) => {

          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.DragDropFile(page, './Tests/TestData/FileOtherThanCSVorTXT.xlsx', 'FileOtherThanCSVorTXT.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          await esslandingPageObjects.expect.errorMessageSelectorContainText('Please select a .csv or .txt file');
     })

     //https://dev.azure.com/ukhydro/ENC%20Publishing/_workitems/edit/61808  
     test('Verify that input of ENC name is not case sensitive ', async ({ page }) => {

          let encAdded = ["DE260001", "DE290001", "US5CN13M", "NZ300661", "RU3P0ZM0", "DE521900"]
          await esslandingPageObjects.addencradiobtnSelectorClick();
          await esslandingPageObjects.setaddSingleENCTextboxSelector("DE260001");
          await esslandingPageObjects.proceedButtonSelectorClick();
          await encSelectionPageObjects.addAnotherENC("de290001");
          await encSelectionPageObjects.addAnotherENC("US5cn13M");
          await encSelectionPageObjects.addAnotherENC("nz300661");
          await encSelectionPageObjects.addAnotherENC("Ru3p0zm0");
          await encSelectionPageObjects.addAnotherENC("de521900");
          await esslandingPageObjects.expect.verifyUploadedENCs(encAdded);
     })

     // https://dev.azure.com/ukhydro/ENC%20Publishing/_workitems/edit/75071
     test('Upload TXT file with all invalid non AIO ENCs and verify information message', async ({ page }) => {

          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/InvalidENCs.txt');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await esslandingPageObjects.expect.VerifyExcludedENCsMessage('No valid ENCs found')
     })

     // https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156779
     // https://dev.azure.com/ukhydro/ENC%20Publishing/_workitems/edit/75071
     test('Upload CSV file with all invalid non AIO ENCs and verify information message', async ({ page }) => {

          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/InvalidENCs.csv');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await encSelectionPageObjects.expect.toBeTruthy(await esslandingPageObjects.messageType.getAttribute("icon-name") == "exclamation");
          await esslandingPageObjects.expect.VerifyExcludedENCsMessage('No valid ENCs found');
          const backgroundColour = await encSelectionPageObjects.messageBackground.evaluate(element => window.getComputedStyle(element).getPropertyValue("background-color"));
          await encSelectionPageObjects.expect.toBeTruthy(backgroundColour == "rgb(247, 225, 225)");
     })

     //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/149496
     test('Verify Base Exchange Set with Valid ENCs', async ({ page }) => {
          await esslandingPageObjects.addencradiobtnSelectorClick();
          await esslandingPageObjects.setaddSingleENCTextboxSelector("DE260001");
          await esslandingPageObjects.proceedButtonSelectorClick();
          const requestPromise = await esslandingPageObjects.page.waitForRequest(request =>
               request.url().includes('productInformation/productIdentifiers') && request.method() === 'POST')
          await esslandingPageObjects.expect.IsNotEmpty(requestPromise.url());
     });

     //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/151340
     //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/151344
     test('Verify Message When Valid ENCs not have an update and Invalid ENCs found for Delta Exchange Set type', async ({ page }) => {

          await encSelectionPageObjects.startAgainLinkSelectorClick();
          await exchangeSetSelectionPageObjects.enterDate(new Date());
          await exchangeSetSelectionPageObjects.clickOnProceedButton()
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/downloadValidAndInvalidENCs.csv');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await esslandingPageObjects.page.waitForResponse(response => response.url().includes('productInformation/productIdentifiers') && response.request().method() === 'POST');
          await esslandingPageObjects.page.waitForResponse(response => response.url().includes('ProductInformation?sinceDateTime=') && response.request().method() === 'GET');
          await encSelectionPageObjects.errorMessage.click();
          let message = await encSelectionPageObjects.errorMessage.innerText();
          await encSelectionPageObjects.expect.toBeTruthy(message.split('.')[0].trim() == "Invalid cells - GZ800112");
          await encSelectionPageObjects.expect.toBeTruthy(message.split('.')[1].trim() == "There have been no updates for the ENCs in the date range selected");
     });

     //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156738
     //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/151345
     test('Verify Warning Message when file contain only invalid ENCs for delta Exchange Set type', async ({ page }) => {

          await encSelectionPageObjects.startAgainLinkSelectorClick();
          await exchangeSetSelectionPageObjects.enterDate(new Date());
          await exchangeSetSelectionPageObjects.clickOnProceedButton();
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/InvalidENCs.csv');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await encSelectionPageObjects.errorMessage.click();
          await encSelectionPageObjects.expect.toBeTruthy(await esslandingPageObjects.messageType.getAttribute("icon-name") == "exclamation");
          await encSelectionPageObjects.expect.toBeTruthy(await encSelectionPageObjects.errorMessage.innerText() == "No valid ENCs found");
          const backgroundColour = await encSelectionPageObjects.messageBackground.evaluate(element => window.getComputedStyle(element).getPropertyValue("background-color"));
          await encSelectionPageObjects.expect.toBeTruthy(backgroundColour == "rgb(247, 225, 225)");
     });

     //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/151356
     test('Verify message for AIO Delta selection', async ({ page }) => {
          var message = "AIO exchange sets are currently not available from this page. Please download them from the main File Share Service site";
          await encSelectionPageObjects.startAgainLinkSelectorClick();
          await exchangeSetSelectionPageObjects.enterDate(new Date());
          await exchangeSetSelectionPageObjects.clickOnProceedButton()
          await esslandingPageObjects.expect.addsingleencSelectorIsVisible();
          await esslandingPageObjects.addencradiobtnSelectorClick();
          await esslandingPageObjects.setaddSingleENCTextboxSelector("FR800002");
          await esslandingPageObjects.proceedButtonSelectorClick();
          await encSelectionPageObjects.errorMessage.click();
          await encSelectionPageObjects.expect.toBeTruthy(message == await encSelectionPageObjects.errorMessage.innerText());
     });

     //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156371
     test("Verify warning box colour when upload list has a combination of invalid enc and enc without any update.", async ({ page }) => {
          await encSelectionPageObjects.startAgainLinkSelectorClick();
          await exchangeSetSelectionPageObjects.enterDate(new Date());
          await exchangeSetSelectionPageObjects.clickOnProceedButton();
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/downloadValidAndInvalidENCs.csv');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await encSelectionPageObjects.expect.toBeTruthy(await esslandingPageObjects.messageType.getAttribute("icon-name") == "triangle-exclamation");
          const message = "Invalid cells - GZ800112.\nThere have been no updates for the ENCs in the date range selected."
          await encSelectionPageObjects.expect.toBeTruthy(message == (await encSelectionPageObjects.errorMessage.innerText()).trim());
          const backgroundColour = await encSelectionPageObjects.messageBackground.evaluate(element => window.getComputedStyle(element).getPropertyValue("background-color"));
          await encSelectionPageObjects.expect.toBeTruthy(backgroundColour == "rgb(248, 237, 227)");
     });

     //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156372
     test("Verify warning box colour when upload list has a combination of invalid enc and AIO cell", async ({ page }) => {
          await encSelectionPageObjects.startAgainLinkSelectorClick();
          await exchangeSetSelectionPageObjects.enterDate(new Date());
          await exchangeSetSelectionPageObjects.clickOnProceedButton();
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/InvalidEncWithAioCell.csv');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await encSelectionPageObjects.expect.toBeTruthy(await esslandingPageObjects.messageType.getAttribute("icon-name") == "exclamation");
          const message = "No valid ENCs found.\nAIO exchange sets are currently not available from this page. Please download them from the main File Share Service site.";
          await encSelectionPageObjects.expect.toBeTruthy(message == (await encSelectionPageObjects.errorMessage.innerText()).trim());
          const backgroundColour = await encSelectionPageObjects.messageBackground.evaluate(element => window.getComputedStyle(element).getPropertyValue("background-color"));
          await encSelectionPageObjects.expect.toBeTruthy(backgroundColour == "rgb(247, 225, 225)");
     });

     //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156771
     test("Verify warning box colour for Base when upload list has a combination of all invalid enc and AIO cell", async ({ page }) => {
          await encSelectionPageObjects.startAgainLinkSelectorClick();
          await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
          await exchangeSetSelectionPageObjects.clickOnProceedButton();
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/InvalidEncWithAioCell.csv');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await encSelectionPageObjects.expect.toBeTruthy(await esslandingPageObjects.messageType.getAttribute("icon-name") == "exclamation");
          const message = "No valid ENCs found.\nAIO exchange sets are currently not available from this page. Please download them from the main File Share Service site.";
          await encSelectionPageObjects.expect.toBeTruthy(message == (await encSelectionPageObjects.errorMessage.innerText()).trim());
          const backgroundColour = await encSelectionPageObjects.messageBackground.evaluate(element => window.getComputedStyle(element).getPropertyValue("background-color"));
          await encSelectionPageObjects.expect.toBeTruthy(backgroundColour == "rgb(247, 225, 225)");
     });

     //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156745
     test("Verify warning box colour for delta when user added single invalid enc", async ({ page }) => {
          await encSelectionPageObjects.startAgainLinkSelectorClick();
          await exchangeSetSelectionPageObjects.enterDate(new Date());
          await exchangeSetSelectionPageObjects.clickOnProceedButton();
          await esslandingPageObjects.addencradiobtnSelectorClick();
          await esslandingPageObjects.setaddSingleENCTextboxSelector("A1720150");
          await esslandingPageObjects.proceedButtonSelectorClick();
          await encSelectionPageObjects.expect.toBeTruthy(await esslandingPageObjects.messageType.getAttribute("icon-name") == "exclamation");
          await encSelectionPageObjects.expect.toBeTruthy((await encSelectionPageObjects.errorMessage.innerText()).trim() == "Invalid ENC number");
          let backgroundColour = await encSelectionPageObjects.messageBackground.evaluate(element => window.getComputedStyle(element).getPropertyValue("background-color"));
          await encSelectionPageObjects.expect.toBeTruthy(backgroundColour == "rgb(247, 225, 225)");
          await esslandingPageObjects.addencradiobtnSelectorClick();
          await esslandingPageObjects.setaddSingleENCTextboxSelector("DE360010");
          await esslandingPageObjects.proceedButtonSelectorClick();
          await page.waitForLoadState();
          await encSelectionPageObjects.addAnotherENC("GZ800112");
          await encSelectionPageObjects.expect.toBeTruthy(await esslandingPageObjects.messageType.getAttribute("icon-name") == "exclamation");
          await encSelectionPageObjects.expect.toBeTruthy((await encSelectionPageObjects.errorMessage.innerText()).trim() == "Invalid ENC number");
          backgroundColour = await encSelectionPageObjects.messageBackground.evaluate(element => window.getComputedStyle(element).getPropertyValue("background-color"));
          await encSelectionPageObjects.expect.toBeTruthy(backgroundColour == "rgb(247, 225, 225)");
     });
})
