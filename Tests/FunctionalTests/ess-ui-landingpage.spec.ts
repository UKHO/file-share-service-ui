import { test } from '@playwright/test';
import { EssLandingPageObjects } from '../../PageObjects/essui-landingpageObjects';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { autoTestConfig } from '../../appSetting.json';
import { LoginPortal } from '../../Helper/CommonHelper';
import { commonObjectsConfig } from '../../PageObjects/commonObjects.json';

test.describe('ESS UI Landing Page Functional Test Scenarios', () => {

     let esslandingPageObjects: EssLandingPageObjects;

     test.beforeEach(async ({ page }) => {

          esslandingPageObjects = new EssLandingPageObjects(page);
          await page.goto(autoTestConfig.url);
          await page.waitForLoadState('load');
          await LoginPortal(page, autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
          await page.locator(fssHomePageObjectsConfig.essLinkSelector).click();
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13806 //
     test('Verify Radio buttons text on ESS landing page', async ({ page }) => {

          await esslandingPageObjects.expect.exchangesettextSelectorIsVisible();
          await esslandingPageObjects.expect.uploadbtntextSelectorContainText("Upload your whole permit file or a .csv file");
          await esslandingPageObjects.expect.addenctextSelectorContainText("Add ENCs");
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13799
     test('Verify clicking on First Radio Button, "click to choose file" control & "Proceed" button available', async ({ page }) => {
          await esslandingPageObjects.uploadradiobtnSelectorClick();

          await esslandingPageObjects.expect.chooseuploadfileoptionSelectorIsVisible();
          await esslandingPageObjects.expect.chooseuploadfileproceedSelectorIsVisible();
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13799 
     test('Verify clicking on Second Radio Button, "Select single ENCs" control & "Proceed" button available', async ({ page }) => {
          await esslandingPageObjects.addencradiobtnSelectorClick();

          await esslandingPageObjects.expect.addsingleencSelectorIsVisible();
          await esslandingPageObjects.expect.proceedButtonSelectorIsVisible();
     })

     //https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13809
     //https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14102 //SPRINT 4 (Added data in ValidENCs.csv)
     test('Verify all the uploaded ENCs from .csv file, displayed on the screen', async ({ page }) => {

          let enclist = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C']
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/ValidENCs.csv');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await page.waitForLoadState();
          await esslandingPageObjects.expect.verifyUploadedENCs(enclist);
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13815
     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14103 //SPRINT 4 (Added data in ValidENCs.csv)
     test('Verify all the uploaded ENCs from .txt file, displayed on the screen', async ({ page }) => {

          let enclist = ['AU220140', 'AU314128', 'AU411129', 'CN484220', 'GB50184C']
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/ValidENCs.txt');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await page.waitForLoadState();
          await esslandingPageObjects.expect.verifyUploadedENCs(enclist);
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13810 //
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

          await esslandingPageObjects.expect.errorMessageExcludeENCsSelectorContainText("Some values have not been added to list.");
          await esslandingPageObjects.expect.uploadedDataSelectorToBeEqual("AU210130");
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13817
     test('Upload TXT file with valid & invalid ENCs and verify ENC uploaded', async ({ page }) => {

          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/ValidAndInvalidENCs.txt');
          await esslandingPageObjects.proceedButtonSelectorClick();
          await esslandingPageObjects.expect.errorMessageExcludeENCsSelectorContainText("Some values have not been added to list.");
          await esslandingPageObjects.expect.uploadedDataSelectorToBeEqual("AU210130");
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13823
     test('Verify uploading valid, invalid & valid duplicate ENC Numbers in CSV File, upload only once.', async ({ page }) => {

          let enclist = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220'];
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData/validAndDuplicateENCs.csv');
          await esslandingPageObjects.proceedButtonSelectorClick();

          await esslandingPageObjects.expect.errorMessageExcludeENCsSelectorContainText("Some values have not been added to list.");

          await esslandingPageObjects.expect.verifyUploadedENCs(enclist);
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13826
     test('Verify uploading valid, invalid & valid duplicate ENC Numbers in TXT File, upload only valid and once.', async ({ page }) => {

          let enclist = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220']
          await esslandingPageObjects.uploadradiobtnSelectorClick();
          await esslandingPageObjects.uploadFile(page, './Tests/TestData//ValidAndDuplicateENCs.txt');
          await esslandingPageObjects.proceedButtonSelectorClick();

          await esslandingPageObjects.expect.errorMessageExcludeENCsSelectorContainText("Some values have not been added to list.");
          await esslandingPageObjects.expect.verifyUploadedENCs(enclist);
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13944
     test('Verify that error displays when user enters invalid single ENC', async ({ page }) => {

          await esslandingPageObjects.addencradiobtnSelectorClick();
          await esslandingPageObjects.setaddSingleENCTextboxSelector("A1720150");
          await esslandingPageObjects.proceedButtonSelectorClick();
          await esslandingPageObjects.expect.errorMessageForInvalidENCSelectorContainText("Invalid ENC number");
     })

 //https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13809
     //https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14102 //SPRINT 4 (Added data in ValidENCs.csv)
     test('Verify all the uploaded ENCs from .csv file, displayed on the screen', async ({ page }) => {
          await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
          await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData/ValidENCs.csv');
          await page.click(esslandingpageObjectsConfig.proceedButtonSelector);
          await page.waitForLoadState();
          let enclist = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C', '3A6LTP10', 'B28LTP10', '221A1B2C']
          expect(await page.locator('//tbody/tr').count()).toBe(enclist.length);

          for (var i = 1; i < 9; i++) {
               expect(await page.innerText("//div/table/tbody/tr[" + i + "]/td[1]")).toEqual(enclist[i - 1]);
          }
     })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13815
     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14103 //SPRINT 4 (Added data in ValidENCs.csv)
     test('Verify all the uploaded ENCs from .txt file, displayed on the screen', async ({ page }) => {
          await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
          await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData/ValidENCs.txt');
          await page.click(esslandingpageObjectsConfig.proceedButtonSelector);
          await page.waitForLoadState();
          let enclist = ['AU220140', 'AU314128', 'AU411129', 'CN484220', 'GB50184C', '908ABCDE', 'B28LTP10']
          expect(await page.locator('//tbody/tr').count()).toBe(enclist.length);

          for (var i = 1; i < 8; i++) {
               expect(await page.innerText("//div/table/tbody/tr[" + i + "]/td[1]")).toEqual(enclist[i - 1]);
          }
     })

});