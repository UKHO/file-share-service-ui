import { test, expect } from '@playwright/test';
import { esslandingpageObjectsConfig } from '../../PageObjects/essui-landingpageObjects.json';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { addAnotherENC, addSingleENC, uploadFile, } from '../../Helper/ESSLandingPageHelper';
import { autoTestConfig } from '../../appSetting.json';
import { LoginPortal } from '../../Helper/CommonHelper';
import { commonObjectsConfig } from '../../PageObjects/commonObjects.json';
import { encselectionpageObjectsConfig } from '../../PageObjects/essui-encselectionpageObjects.json'

test.describe('ESS UI ENCs Selection Page Functional Test Scenarios', () => {

   test.beforeEach(async ({ page }) => {
      await page.goto(autoTestConfig.url);
      await page.waitForLoadState('load');
      await LoginPortal(page, autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
      await page.locator(fssHomePageObjectsConfig.essLinkSelector).click();
      await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
      await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData/ENCs_Sorting.csv');
      await page.click(esslandingpageObjectsConfig.proceedButtonSelector);
   })

   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13960
   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13940
   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13941
   test('Verify selecting and deselecting multiple checkboxes in left hand table, shows expected result in right hand table', async ({ page }) => {

      let encSelected = ['AU220150', 'CA271105', 'AU5PTL01']
      // To select ENCs
      for (var i = 1; i <= 3; i++) {
         await page.click("//div/table/tbody/tr[" + i + "]/td[2]");
         await expect((await page.innerText("//div/div[2]/div[3]/div[1]/table/tbody/tr[" + i + "]/td[1]"))).toEqual(encSelected[i - 1]);
      }
      // To deselect ENCs using checkbox
      for (var i = 1; i <= 3; i++) {
         await page.click("//div/table/tbody/tr[" + i + "]/td[2]");
         await expect(page.innerText(encselectionpageObjectsConfig.rightTableEncPositionSeletor)).not.toEqual(encSelected[i - 1]);
      }
      let count = await page.locator(encselectionpageObjectsConfig.rightTableRowsCountSelector).count();
      await expect(count).toEqual(0);
      // To deselect ENCs using "X" button.
      await page.click(encselectionpageObjectsConfig.firstCheckBoxSelector);
      await page.click(encselectionpageObjectsConfig.XButtonSelector);
      await expect(page.locator(encselectionpageObjectsConfig.firstCheckBoxSelector)).not.toBeChecked();
      await expect(page.locator(encselectionpageObjectsConfig.XButtonSelector)).toBeHidden();
   })

   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13961
   test('Check the functionality for Sorting of ENC numbers in ascending or descending order', async ({ page }) => {

      let ascOrderlist = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C']
      let dscOrderlist = ['GB50184C', 'CN484220', 'CA271105', 'AU5PTL01', 'AU220150']
      await page.click(encselectionpageObjectsConfig.encNameSelector);
      for (var i = 1; i < 6; i++) {
         expect(await page.innerText("//div/table/tbody/tr[" + i + "]/td[1]")).toEqual(ascOrderlist[i - 1]);
      }
      await page.click(encselectionpageObjectsConfig.encNameSelector);
      for (var i = 1; i < 6; i++) {
         expect(await page.innerText("//div/table/tbody/tr[" + i + "]/td[1]")).toEqual(dscOrderlist[i - 1]);
      }
   })

   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13962 (For verify Text)
   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13959 (For verify Table as per ukho design)
   test('Verify Text on the top of ENC list.', async ({ page }) => {

      expect(await page.isVisible(encselectionpageObjectsConfig.startLinkSelector)).toBeTruthy();
      expect(await page.innerText(encselectionpageObjectsConfig.textAboveTableSelector)).toEqual(encselectionpageObjectsConfig.textAboveTable);
   })
   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13949
   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13950
   test('Verify limit for selecting ENCs (i.e.100) in left hand table', async ({ page }) => {

      await page.click(encselectionpageObjectsConfig.startAgainLinkSelector);
      await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
      await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData/ValidAndInvalidENCs.csv');
      await page.click(esslandingpageObjectsConfig.proceedButtonSelector);
      await page.waitForLoadState();

      for (var i = 1; i < 101; i++) {
         await page.click("//div/table/tbody/tr[" + i + "]/td[2]");
}
      let selection = await page.locator(encselectionpageObjectsConfig.rightTableRowsCountSelector).count();
      await expect(selection).toEqual(100);
      await page.click(encselectionpageObjectsConfig['101thEncSelector']);
      await page.waitForSelector(encselectionpageObjectsConfig.maxLimitEncmessageSelector);
      expect(await page.innerText(encselectionpageObjectsConfig.maxLimitEncmessageSelector)).toEqual(encselectionpageObjectsConfig.maxLimitEncmessage);
   })

   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13944 (For valid ENC no.)
   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13945 (For "Your selection" table)
   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13946 (For "Start again" link)
   test('Verify that user is able to add a valid single ENCs and link "Start Again" redirects to ESS landing page', async ({ page }) => {
      await page.click(encselectionpageObjectsConfig.startAgainLinkSelector);
      await addSingleENC(page, esslandingpageObjectsConfig.addSingleENCTextboxSelector);
      expect(await page.innerText(encselectionpageObjectsConfig.firstEncSelector)).toEqual(esslandingpageObjectsConfig.ENCValue2);
      await expect(page.locator(esslandingpageObjectsConfig.selectionTextSelector)).toBeVisible();
      await page.click(encselectionpageObjectsConfig.startAgainLinkSelector);
      await expect(page.locator(esslandingpageObjectsConfig.exchangesettextSelector)).toBeVisible();
   })

   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13954 - Add Anther ENC
   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13956 - Duplicate ENC
   test('Verify that after clicking on "Add another ENC" link, user able to add another ENC number', async ({ page }) => {
      await page.click(encselectionpageObjectsConfig.startAgainLinkSelector);
      await addSingleENC(page, esslandingpageObjectsConfig.addSingleENCTextboxSelector);
      await expect(page.locator(encselectionpageObjectsConfig.addAnotherENCSelector)).toBeVisible();
      await addAnotherENC(page, encselectionpageObjectsConfig.addAnotherENCSelector);
      expect(await page.innerText(encselectionpageObjectsConfig.secondEncSelector)).toEqual(esslandingpageObjectsConfig.ENCValue1);
      expect(await page.isChecked(encselectionpageObjectsConfig.anotherCheckBoxSelector)).toBeFalsy();
      //13956 - Add another ENC2 - Duplicate No.
      await addAnotherENC(page, encselectionpageObjectsConfig.addAnotherENCSelector);
      await expect(page.locator(encselectionpageObjectsConfig.errorMessageForDuplicateNumberSelector)).toContainText(encselectionpageObjectsConfig.errorMsgDuplicateENC)
      let count = await page.locator(encselectionpageObjectsConfig.leftTableRowsCountSelector).count();
      expect(count).toEqual(2);
   })

   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13957
   test('Verify that user is not able to add more than Maxlimit (currently configured as 250) ENCs using manually adding ENCs', async ({ page }) => {
      await page.click(encselectionpageObjectsConfig.startAgainLinkSelector);
      await addSingleENC(page, esslandingpageObjectsConfig.addSingleENCTextboxSelector);
      await page.locator(encselectionpageObjectsConfig.addAnotherENCSelector).click();
      for (var i = 0; i < 10; i++) {
         await page.fill(encselectionpageObjectsConfig.typeENCTextBoxSelector, "AU21010" + i);
         await page.locator(encselectionpageObjectsConfig.addENCButtonSelector).click();
      }
      for (var i = 10; i < 100; i++) {
         await page.fill(encselectionpageObjectsConfig.typeENCTextBoxSelector, "CA2101" + i);
         await page.waitForSelector(encselectionpageObjectsConfig.addENCButtonSelector);
         await page.locator(encselectionpageObjectsConfig.addENCButtonSelector).click();
      }
      for (var i = 100; i < 250; i++) {
         await page.fill(encselectionpageObjectsConfig.typeENCTextBoxSelector, "CN210" + i);
         await page.waitForSelector(encselectionpageObjectsConfig.addENCButtonSelector);
         await page.locator(encselectionpageObjectsConfig.addENCButtonSelector).click();
      }
      await expect(page.locator(encselectionpageObjectsConfig.errorMsgMaxLimitSelector)).toContainText(encselectionpageObjectsConfig.errorMsgMaxLimit);
   })
})