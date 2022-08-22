import {test, expect, Page, chromium} from '@playwright/test';
import {esslandingpageObjectsConfig} from '../../PageObjects/essui-landingpageObjects.json';
import {fssHomePageObjectsConfig} from '../../PageObjects/fss-homepageObjects.json';
import {uploadFile}from '../../Helper/ESSLandingPageHelper';
import {autoTestConfig} from '../../appSetting.json';
import {LoginPortal} from '../../Helper/CommonHelper';
import {commonObjectsConfig} from '../../PageObjects/commonObjects.json';

test.describe('ESS UI Landing Page Functional Test Scenarios', ()=>{

     test.beforeEach(async({page})=>{
     
        await page.goto(autoTestConfig.url);
        await page.waitForLoadState('load');
        await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await page.locator(fssHomePageObjectsConfig.essLinkSelector).click();
     })

     // Test case 13806
     test('Verify Radio buttons text on ESS landing page', async({page})=>{
          await expect (page.locator(esslandingpageObjectsConfig.exchangesettextSelector)).toBeVisible; 
          await expect (page.locator(esslandingpageObjectsConfig.uploadbtntextSelector)).toContainText(esslandingpageObjectsConfig.radioButton1Name);
          await expect (page.locator(esslandingpageObjectsConfig.addenctextSelector)).toContainText(esslandingpageObjectsConfig.radioButton2Name);
     })

     // Test case 13799
     test('Verify clicking on First Radio Button, "click to choose file" control & "Proceed" button available', async({page})=>{
          await page.locator(esslandingpageObjectsConfig.uploadradiobtnSelector).click(); 
          await expect (page.locator(esslandingpageObjectsConfig.chooseuploadfileoptionSelector)).toBeVisible();  
          await expect (page.locator(esslandingpageObjectsConfig.chooseuploadfileproceedSelector)).toBeVisible(); 
     })

     // Test case 13799
     test('Verify clicking on Second Radio Button, "Select single ENCs" control & "Proceed" button available', async({page})=>{
          await page.locator(esslandingpageObjectsConfig.addencradiobtnSelector).click();
          await expect (page.locator(esslandingpageObjectsConfig.addsingleencSelector)).toBeVisible();
          await expect (page.locator(esslandingpageObjectsConfig.proceedButtonSelector)).toBeVisible();    
     })

     // Test Case 13809
      test('Verify all the uploaded ENCs from .csv file, displayed on the screen', async({page})=>{
          await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
          await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData/ValidENCs.csv');
          await page.click(esslandingpageObjectsConfig.proceedButtonSelector);
          await page.waitForLoadState();
          let enclist = ['AU220150', 'AU5PTL01', 'CA271105','CN484220','GB50184C']         
          for (var i=1;i<6;i++) 
          {            
               expect (await page.innerText("//div/table/tbody/tr["+i+"]/td[1]")).toEqual(enclist[i-1]);
          }        
     
     })

      // Test Case 13815
      test('Verify all the uploaded ENCs from .txt file, displayed on the screen', async({page})=>{
          await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
          await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData/ValidENCs.txt');
          await page.click(esslandingpageObjectsConfig.proceedButtonSelector);
          await page.waitForLoadState();
          let enclist = ['AU220140', 'AU314128', 'AU411129','CN484220','GB50184C']         
          for (var i=1;i<6;i++) 
          {            
               expect (await page.innerText("//div/table/tbody/tr["+i+"]/td[1]")).toEqual(enclist[i-1]);
          }        
     
     })

     //Test Case 13810
     test('Verify a error message if user tries to upload other than allowed files', async({page})=>{
         
         await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
         await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData/FileOtherThanCSVorTXT.xlsx');
         await expect(page.locator(esslandingpageObjectsConfig.errorMessageSelector)).toContainText('Please select a .csv or .txt');
     })
    
     //Test Case 13811
     test('Upload CSV file with valid & invalid ENCs and verify ENC uploaded', async({page})=>{
        
          await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
          await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData/validAndInvalidENCs.csv');
          await page.click(esslandingpageObjectsConfig.proceedButtonSelector);
          await expect (page.locator(esslandingpageObjectsConfig.errorMessageExcludeENCsSelector)).toContainText(esslandingpageObjectsConfig.messageForOverlimitAndInvalidENCs) 
          expect (await page.innerText(esslandingpageObjectsConfig.uploadedDataSelector)).toEqual(esslandingpageObjectsConfig.ENCValue2);
     })

     //Test Case 13817
     test('Upload TXT file with valid & invalid ENCs and verify ENC uploaded', async({page})=>{
       
          await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
          await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData/ValidAndInvalidENCs.txt');
          await page.click(esslandingpageObjectsConfig.proceedButtonSelector);
          await expect (page.locator(esslandingpageObjectsConfig.errorMessageExcludeENCsSelector)).toContainText(esslandingpageObjectsConfig.messageForOverlimitAndInvalidENCs)
          expect (await page.innerText(esslandingpageObjectsConfig.uploadedDataSelector)).toEqual(esslandingpageObjectsConfig.ENCValue2);
     })

     //Test Case 13823
     test('Verify uploading valid duplicate ENC Number in CSV File, upload only once.', async({page})=>{
          
          await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
          await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData/validAndDuplicateENCs.csv');
          await page.click(esslandingpageObjectsConfig.proceedButtonSelector);
          await expect (page.locator(esslandingpageObjectsConfig.errorMessageExcludeENCsSelector)).toContainText(esslandingpageObjectsConfig.messageForOverlimitAndInvalidENCs)
          let enclist = ['AU220150', 'AU5PTL01', 'CA271105','CN484220']         
          for (var i=1;i<5;i++) 
          {            
               expect (await page.innerText("//div/table/tbody/tr["+i+"]/td[1]")).toEqual(enclist[i-1]);
          } 
     })

     //Test Case 13826
     test('Verify uploading valid duplicate ENC Number in TXT File, upload only once.', async({page})=>{
          await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
          await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData//ValidAndDuplicateENCs.txt');
          await page.click(esslandingpageObjectsConfig.proceedButtonSelector);
          await expect (page.locator(esslandingpageObjectsConfig.errorMessageExcludeENCsSelector)).toContainText(esslandingpageObjectsConfig.messageForOverlimitAndInvalidENCs)
          let enclist = ['AU220150', 'AU5PTL01', 'CA271105','CN484220']         
          for (var i=1;i<5;i++) 
          {            
               expect (await page.innerText("//div/table/tbody/tr["+i+"]/td[1]")).toEqual(enclist[i-1]);
          } 
     })

    
});