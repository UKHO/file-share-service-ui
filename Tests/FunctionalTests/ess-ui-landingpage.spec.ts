import {test, expect} from '@playwright/test';
import {esslandingpageObjectsConfig} from '../../PageObjects/essui-landingpageObjects.json';
import {navigateToESSLandingPage}from '../../Helper/ESSLandingPageHelper';
import {uploadfile} from '../../Helper/ESSLandingPageHelper';
import {addENCnumbers} from '../../Helper/ESSLandingPageHelper';
import {autoTestConfig} from '../../appSetting.json';
import {LoginPortal} from '../../Helper/CommonHelper';
import {commonObjectsConfig} from '../../PageObjects/commonObjects.json';

test.describe('FSS-UI-LandingPage', ()=>{

   test.beforeEach(async({page})=>{
        await page.goto(autoTestConfig.url);
        await page.waitForLoadState('load');
        await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await navigateToESSLandingPage(page);
     })

     // Test case 13806
     test('Verify Radio buttons text on ESS landing page', async({page})=>{
          await expect (page.locator(esslandingpageObjectsConfig.exchangesettextselector)).toBeVisible; 
          await expect (page.locator(esslandingpageObjectsConfig.uploadbtntextselector)).toContainText(esslandingpageObjectsConfig.radioButtonName);
          await expect (page.locator(esslandingpageObjectsConfig.addenctextselector)).toContainText(esslandingpageObjectsConfig.RadioBtn2text);
     })

     // Test case 13799
     test('Verify clicking on First Radio Button, "click to choose file" control & "Proceed" button available', async({page})=>{
          await uploadfile(page);
          await expect (page.locator(esslandingpageObjectsConfig.chooseuploadfileoptionselector)).toBeVisible();  
          await expect (page.locator(esslandingpageObjectsConfig.chooseuploadfileproceedselector)).toBeVisible(); 
     })

     // Test case 13799
     test.only('Verify clicking on Second Radio Button, "Select single ENCs" control & "Proceed" button available', async({page})=>{
          await addENCnumbers(page);
          await expect (page.locator(esslandingpageObjectsConfig.addsingleencselector)).toBeVisible();
          await expect (page.locator(esslandingpageObjectsConfig.addsingleencproceedselector)).toBeVisible();    
     })

});