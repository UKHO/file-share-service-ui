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
   test('Verify Functionality of Checkbox,when single checkbox is selected', async ({ page }) => {

      await page.click(essencselectionpageObjectsConfig.firstCheckboxSelector);
      await expect(page.locator(essencselectionpageObjectsConfig.firstCheckboxSelector)).toBeChecked();
      await expect(page.locator(essencselectionpageObjectsConfig.firstencSelectedSelector)).toBeVisible();
   })

   
   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13960
   test.only('Verify Functionality of Checkbox,when multiple checkbox is selected', async ({ page }) => {
      
     // let count = await page.locator('//tbody/tr').count();
      //console.log(count);
      let encSelected=['AU220150','CA271105','AU5PTL01']
       for (var i=1;i<=3;i++)   
      {            
         await page.click("//div/table/tbody/tr["+i+"]/td[2]");
         await expect((await page.innerText("//div/div[2]/div[3]/div[1]/table/tbody/tr["+i+"]/td[1]"))).toEqual(encSelected[i-1]);
      } 
      
      // old code
      // let checkboxList = [essencselectionpageObjectsConfig.firstCheckboxSelector,essencselectionpageObjectsConfig.secondCheckboxSelector, essencselectionpageObjectsConfig.thirdCheckboxSelector] 
      // // await page.click(essencselectionpageObjectsConfig.firstCheckboxSelector);
      // // await page.click(essencselectionpageObjectsConfig.secondCheckboxSelector);
      // // await page.click(essencselectionpageObjectsConfig.thirdCheckboxSelector);

      // for (var i=0;i<3;i++)
      // {
      //    await page.click(checkboxList[i]);
      // }
      
   
      // for (var i=0;i<3;i++)
      // {
      // await expect(page.locator(checkboxList[i])).toBeChecked();
      // }

      // let checkboxSelected = [essencselectionpageObjectsConfig.firstencSelectedSelector,essencselectionpageObjectsConfig.secondencSelectedSelector, essencselectionpageObjectsConfig.thirdencSelectedSelector] 
      // let value=['AU220150','CA271105','AU5PTL01']
      // console.log("K " +value[0]);
      // for (var i=0;i<3;i++)
      // {
      //    for (var k=0;k<3;k++)
      //    {
      //    await expect(page.innerText(checkboxSelected[i])).toEqual(value[k]);
      //    }
      // }
      
      // // await expect(page.locator(essencselectionpageObjectsConfig.secondCheckboxSelector)).toBeChecked();
      // // await expect(page.locator(essencselectionpageObjectsConfig.thirdCheckboxSelector)).toBeChecked();

      // // await expect(page.locator(essencselectionpageObjectsConfig.firstencSelectedSelector)).toBeVisible();
      // // await expect(page.locator(essencselectionpageObjectsConfig.secondencSelectedSelector)).toBeVisible();
      // // await expect(page.locator(essencselectionpageObjectsConfig.thirdencSelectedSelector)).toBeVisible();
   })

   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13961
   test('Check the functionality for Sorting of ENC numbers in ascending or descending order', async ({ page }) => {

      await page.click(essencselectionpageObjectsConfig.encNameSelector);
      var FirstElementAscOrder = await page.innerText(essencselectionpageObjectsConfig.firstElementSortSelector);
      var LastElementAscOrder = await page.innerText(essencselectionpageObjectsConfig.lastElementSortSelector);
      await page.click(essencselectionpageObjectsConfig.encNameSelector);
      var FirstElementDescOrder = await page.innerText(essencselectionpageObjectsConfig.firstElementSortSelector);
      var LastElementDescOrder = await page.innerText(essencselectionpageObjectsConfig.lastElementSortSelector);
      expect(FirstElementAscOrder).not.toEqual(FirstElementDescOrder);
      expect(LastElementAscOrder).not.toEqual(LastElementDescOrder);
   })

   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13962 (For verify Text)
   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13959 (For verify Table as per ukho design)
   test('Verify Text on the top of ENC list.', async ({ page }) => {

      expect(await page.isVisible(essencselectionpageObjectsConfig.startLinkSelector)).toBeTruthy();
      expect(await page.innerText(essencselectionpageObjectsConfig.textAboveTableSelector)).toEqual(essencselectionpageObjectsConfig.textAboveTable);
   })
});