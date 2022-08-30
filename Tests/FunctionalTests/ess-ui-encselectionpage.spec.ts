import {test, expect, Page, chromium} from '@playwright/test';
import {esslandingpageObjectsConfig} from '../../PageObjects/essui-landingpageObjects.json';
import {fssHomePageObjectsConfig} from '../../PageObjects/fss-homepageObjects.json';
import {uploadFile}from '../../Helper/ESSLandingPageHelper';
import {autoTestConfig} from '../../appSetting.json';
import {LoginPortal} from '../../Helper/CommonHelper';
import {commonObjectsConfig} from '../../PageObjects/commonObjects.json';
import {essencselectionpageObjectsConfig} from '../../PageObjects/essui-encselectionpageObjects.json'

test.describe('ESS UI Landing Page Functional Test Scenarios', ()=>{

    test.beforeEach(async({page})=>{
    
       await page.goto(autoTestConfig.url);
       await page.waitForLoadState('load');
       await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
       await page.locator(fssHomePageObjectsConfig.essLinkSelector).click();
    })

      // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13960
      test('Verify Functionality of Checkbox,when single checkbox is selected', async({page})=>{
          await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
          await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData/ValidENCs.txt');
          await page.click(esslandingpageObjectsConfig.proceedButtonSelector);
          await page.click(essencselectionpageObjectsConfig.firstCheckboxSelector);
          await expect (page.locator(essencselectionpageObjectsConfig.firstCheckboxSelector)).toBeChecked();
          await expect (page.locator(essencselectionpageObjectsConfig.firstencSelectedSelector)).toBeVisible();
      })

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13960
    test('Verify Functionality of Checkbox,when multiple checkbox is selected', async({page})=>{
        await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
        await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData/ValidENCs.txt');
        await page.click(esslandingpageObjectsConfig.proceedButtonSelector);
        await page.click(essencselectionpageObjectsConfig.firstCheckboxSelector);
        await page.click(essencselectionpageObjectsConfig.secondCheckboxSelector);
        await page.click(essencselectionpageObjectsConfig.thirdCheckboxSelector);
        await expect (page.locator(essencselectionpageObjectsConfig.firstCheckboxSelector)).toBeChecked();
        await expect (page.locator(essencselectionpageObjectsConfig.secondCheckboxSelector)).toBeChecked();
        await expect (page.locator(essencselectionpageObjectsConfig.thirdCheckboxSelector)).toBeChecked();
        await expect (page.locator(essencselectionpageObjectsConfig.firstencSelectedSelector)).toBeVisible();
        await expect (page.locator(essencselectionpageObjectsConfig.secondencSelectedSelector)).toBeVisible();
        await expect (page.locator(essencselectionpageObjectsConfig.thirdencSelectedSelector)).toBeVisible();
     })

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13961
   test('Check the functionality for Sorting of ENC numbers in ascending or descending order', async({page})=>{
        await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
        await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData/ValidENCsForSorting.csv');
        await page.click(esslandingpageObjectsConfig.proceedButtonSelector);
        await page.click(essencselectionpageObjectsConfig.encNameSelector);
        var FirstElementAscOrder = await page.innerText(essencselectionpageObjectsConfig.firstElementSortSelector);
        var LastElementAscOrder  = await page.innerText(essencselectionpageObjectsConfig.lastElementSortSelector);
        await page.click(essencselectionpageObjectsConfig.encNameSelector);
        var FirstElementDescOrder =await page.innerText(essencselectionpageObjectsConfig.firstElementSortSelector);
        var LastElementDescOrder = await page.innerText(essencselectionpageObjectsConfig.lastElementSortSelector);
        expect(FirstElementAscOrder).not.toEqual(FirstElementDescOrder);
        expect(LastElementAscOrder).not.toEqual(LastElementDescOrder);
     })

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13962 (For verify Text)
    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13959 (For verify Table as per ukho design)
   test('Verify Text on the top of ENC list.', async({page})=>{
        await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
        await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData/ValidENCsForSorting.csv');
        await page.click(esslandingpageObjectsConfig.proceedButtonSelector);
        expect (await page.isVisible (essencselectionpageObjectsConfig.startLinkSelector)).toBeTruthy();
        expect (await page.innerText(essencselectionpageObjectsConfig.textAboveTableSelector)).toEqual(essencselectionpageObjectsConfig.textAboveTable);
     })
});

