import {test, expect, Page, chromium} from '@playwright/test';
import {esslandingpageObjectsConfig} from '../../PageObjects/essui-landingpageObjects.json';
import { essencselectionpageObjectsConfig } from '../../PageObjects/essui-encselectionpageObjects.json'
import {fssHomePageObjectsConfig} from '../../PageObjects/fss-homepageObjects.json';
import {autoTestConfig} from '../../appSetting.json';
import {uploadFile}from '../../Helper/ESSLandingPageHelper';
import {LoginPortal} from '../../Helper/CommonHelper';
import {commonObjectsConfig} from '../../PageObjects/commonObjects.json';

test.describe('ESS UI Landing Page Functional Test Scenarios', ()=>{

     test.beforeEach(async({page})=>{
     
        await page.goto(autoTestConfig.url);
        await page.waitForLoadState('load');
        await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await page.locator(fssHomePageObjectsConfig.essLinkSelector).click();
        await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
        await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData/Valid101ENCs.csv');
        await page.click(esslandingpageObjectsConfig.proceedButtonSelector);
     })

   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13949
test('Scenario1 - Verify when 100 checkboxes selected in left hand table, shows under selected section in right hand table', async({page})=>{
   
   for (var i=1;i<=100;i++) 
   {            
      await page.click("//div/table/tbody/tr["+i+"]/td[2]");
      await expect(page.locator("//div/table/tbody/tr["+i+"]/td[1]").last()).toBeVisible();
   }   
   })

   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13950
test('Scenario2 - Verify when more than 100 checkboxes selected in left hand table, User should get message "No more than 100 ENCs can be selected."', async({page})=>{
   let count = await page.locator('//tbody/tr').count();
   for (var i=1;i<=count;i++) 
   {            
      await page.click("//div/table/tbody/tr["+i+"]/td[2]");
      await expect(page.locator("//div/table/tbody/tr["+i+"]/td[1]").last()).toBeVisible();
   }   
      await expect(page.locator(essencselectionpageObjectsConfig.messageSelector)).toBeVisible();
   })

   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13940
test('Verifying Checkbox Functionality',async({page})=>{
      await page.click(essencselectionpageObjectsConfig.firstCheckBoxSelector);
      await expect(page.locator(essencselectionpageObjectsConfig.firstENCSelector).innerHTML).toEqual(page.locator(essencselectionpageObjectsConfig.firstSelectedENC).innerHTML);
      await page.click(essencselectionpageObjectsConfig.firstCheckBoxSelector);
      await expect(page.locator(essencselectionpageObjectsConfig.firstSelectedENCSelector)).toBeHidden();
      
   })

   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13941
test('Verifying functionality of "x" box',async({page})=>{
      await page.click(essencselectionpageObjectsConfig.firstCheckBoxSelector);
      await page.click(essencselectionpageObjectsConfig.firstSelectedENCXBoxSelector);
      await expect(page.locator(essencselectionpageObjectsConfig.firstCheckBoxSelector)).not.toBeChecked();
      await expect(page.locator(essencselectionpageObjectsConfig.firstSelectedENCSelector)).toBeHidden();
      })
});
