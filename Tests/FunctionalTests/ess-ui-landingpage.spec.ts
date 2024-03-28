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
     test ('Verify clicking on First Radio Button, "click to choose a file" control and "Proceed" button available And also verify Max ENC upload limit & Max Selected ENC limit', async ({ page }) => {
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

          let enclist = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C', '3A6LTP10', 'B28LTP10', '221A1B2C']
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/ValidENCs.csv');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await page.waitForLoadState();
          await esslandingPageObjects.expect.verifyUploadedENCs(enclist);
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13815
     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14103 
     //https://dev.azure.com/ukhydro/ENC%20Publishing/_workitems/edit/61807            
     test('Verify all the uploaded ENCs from .txt file, displayed on the screen', async ({ page }) => {

          let enclist = ['AU220140', 'AU314128', 'AU411129', 'CN484220', 'GB50184C', '908ABCDE', 'B28LTP10']
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/ValidENCs.txt');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await page.waitForLoadState();
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

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13823
     test('Verify uploading valid, invalid & valid duplicate ENC Numbers in CSV File, upload only once.', async ({ page }) => {

          let enclist = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220'];
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/validAndDuplicateENCs.csv');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await esslandingPageObjects.expect.VerifyExcludedENCsMessage("Some values have not been added to list.");
          await esslandingPageObjects.expect.verifyUploadedENCs(enclist);
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13826
     test('Verify uploading valid, invalid & valid duplicate ENC Numbers in TXT File, upload only valid and once.', async ({ page }) => {

          let enclist = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220']
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData//ValidAndDuplicateENCs.txt');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await esslandingPageObjects.expect.VerifyExcludedENCsMessage("Some values have not been added to list.");
          await esslandingPageObjects.expect.verifyUploadedENCs(enclist);
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13944
     test('Verify that error displays when user enters invalid single ENC', async ({ page }) => {

          await esslandingPageObjects.addencradiobtnSelectorClick();
          await esslandingPageObjects.setaddSingleENCTextboxSelector("A1720150");
          await esslandingPageObjects.proceedButtonSelectorClick();
          await esslandingPageObjects.expect.errorMessageForInvalidENCSelectorContainText("Invalid ENC number");
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

          let encAdded = ["KK123456","AA123456","AB123456","BC123456","KK12H456","3A6LTP10"]
          await esslandingPageObjects.addencradiobtnSelectorClick();
          await esslandingPageObjects.setaddSingleENCTextboxSelector("KK123456");
          await esslandingPageObjects.proceedButtonSelectorClick();
          await encSelectionPageObjects.addAnotherENC("aa123456");
          await encSelectionPageObjects.addAnotherENC("Ab123456");
          await encSelectionPageObjects.addAnotherENC("bC123456");
          await encSelectionPageObjects.addAnotherENC("KK12h456");
          await encSelectionPageObjects.addAnotherENC("3a6ltp10");
          await esslandingPageObjects.expect.verifyUploadedENCs(encAdded);
     })
  
     // https://dev.azure.com/ukhydro/ENC%20Publishing/_workitems/edit/75071
      test('Upload TXT file with all invalid non AIO ENCs and verify information message', async ({ page}) => {
          
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/InvalidENCs.txt');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await esslandingPageObjects.expect.VerifyExcludedENCsMessage('No valid ENCs found.')
     })

     // https://dev.azure.com/ukhydro/ENC%20Publishing/_workitems/edit/75071
      test('Upload CSV file with all invalid non AIO ENCs and verify information message', async ({ page}) => {
          
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/InvalidENCs.csv');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await esslandingPageObjects.expect.VerifyExcludedENCsMessage('No valid ENCs found.')
     })

     //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/149496
     test('Verify Base Exchange Set with Valid ENCs', async ({ page }) => {
          await esslandingPageObjects.addencradiobtnSelectorClick();
          await esslandingPageObjects.setaddSingleENCTextboxSelector("AU220150");
          await esslandingPageObjects.proceedButtonSelectorClick();
          const requestPromise = await esslandingPageObjects.page.waitForRequest(request =>
               request.url().includes('productInformation/productIdentifiers') && request.method() === 'POST')
          await esslandingPageObjects.expect.IsEmpty(requestPromise.url());
     });
})