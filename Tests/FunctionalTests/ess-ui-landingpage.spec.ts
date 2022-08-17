import {test, expect} from '@playwright/test';
import {esslandingpageObjectsConfig} from '../../PageObjects/essui-landingpageObjects.json';
import {navigateToESSLandingPage}from '../../Helper/ESSLandingPageHelper';
import {uploadfile} from '../../Helper/ESSLandingPageHelper';
import {addENCnumbers} from '../../Helper/ESSLandingPageHelper';
import {autoTestConfig} from '../../appSetting.json';
import {LoginPortal} from '../../Helper/CommonHelper';
import {commonObjectsConfig} from '../../PageObjects/commonObjects.json';

test.describe('ESS UI Landing Page Functional Test Scenarios', ()=>{

   test.beforeEach(async({page})=>{
        await page.goto(autoTestConfig.url);
        await page.waitForLoadState('load');
        await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await navigateToESSLandingPage(page);
     })

     // Test case 13806
     test('Verify Radio buttons text on ESS landing page', async({page})=>{
          await expect (page.locator(esslandingpageObjectsConfig.exchangesettextSelector)).toBeVisible; 
          await expect (page.locator(esslandingpageObjectsConfig.uploadbtntextSelector)).toContainText(esslandingpageObjectsConfig.radioButton1Name);
          await expect (page.locator(esslandingpageObjectsConfig.addenctextSelector)).toContainText(esslandingpageObjectsConfig.radioButton2Name);
     })

     // Test case 13799
     test('Verify clicking on First Radio Button, "click to choose file" control & "Proceed" button available', async({page})=>{
          await uploadfile(page);
          await expect (page.locator(esslandingpageObjectsConfig.chooseuploadfileoptionSelector)).toBeVisible();  
          await expect (page.locator(esslandingpageObjectsConfig.chooseuploadfileproceedSelector)).toBeVisible(); 
     })

     // Test case 13799
     test('Verify clicking on Second Radio Button, "Select single ENCs" control & "Proceed" button available', async({page})=>{
          await addENCnumbers(page);
          await expect (page.locator(esslandingpageObjectsConfig.addsingleencSelector)).toBeVisible();
          await expect (page.locator(esslandingpageObjectsConfig.addsingleencproceedSelector)).toBeVisible();    
     })

});