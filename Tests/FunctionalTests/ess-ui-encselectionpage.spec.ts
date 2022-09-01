import { test, expect, Page, chromium } from '@playwright/test';
import { esslandingpageObjectsConfig } from '../../PageObjects/essui-landingpageObjects.json';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { uploadFile } from '../../Helper/ESSLandingPageHelper';
import { autoTestConfig } from '../../appSetting.json';
import { LoginPortal } from '../../Helper/CommonHelper';
import { commonObjectsConfig } from '../../PageObjects/commonObjects.json';
import { essencselectionpageObjectsConfig } from '../../PageObjects/essui-encselectionpageObjects.json'

test.describe('ESS UI ENC Selection Page Functional Test Scenarios', () => {

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
      // To deselect ENCs
      for (var i = 1; i <= 3; i++) {
         await page.click("//div/table/tbody/tr[" + i + "]/td[2]");
      }
      let count = await page.locator(essencselectionpageObjectsConfig.rightHandTableRowsSelector).count();
      await expect(count).toEqual(0);

      // Deselect ENCs using "X" button.
      await page.click(essencselectionpageObjectsConfig.firstCheckBoxSelector);
      await page.click(essencselectionpageObjectsConfig.XButtonSelector);
      await expect(page.locator(essencselectionpageObjectsConfig.firstCheckBoxSelector)).not.toBeChecked();
      await expect(page.locator(essencselectionpageObjectsConfig.XButtonSelector)).toBeHidden();
   })

   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13961
   test('Check the functionality for Sorting of ENC numbers in ascending or descending order', async ({ page }) => {

      let ascOrderlist = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C']
      let dscOrderlist = ['GB50184C', 'CN484220', 'CA271105', 'AU5PTL01', 'AU220150']
      await page.click(essencselectionpageObjectsConfig.encNameSelector);
      for (var i = 1; i < 6; i++) {
         expect(await page.innerText("//div/table/tbody/tr[" + i + "]/td[1]")).toEqual(ascOrderlist[i - 1]);
      }
      await page.click(essencselectionpageObjectsConfig.encNameSelector);
      for (var i = 1; i < 6; i++) {
         expect(await page.innerText("//div/table/tbody/tr[" + i + "]/td[1]")).toEqual(dscOrderlist[i - 1]);
      }
   })

   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13962 (For verify Text)
   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13959 (For verify Table as per ukho design)
   test('Verify Text on the top of ENC list.', async ({ page }) => {

      expect(await page.isVisible(essencselectionpageObjectsConfig.startLinkSelector)).toBeTruthy();
      expect(await page.innerText(essencselectionpageObjectsConfig.textAboveTableSelector)).toEqual(essencselectionpageObjectsConfig.textAboveTable);
   })
});