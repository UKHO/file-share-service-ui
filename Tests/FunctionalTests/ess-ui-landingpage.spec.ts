import {test, expect} from '@playwright/test';
import {esslandingpageObjectsConfig} from '../../PageObjects/essui-landingpageObjects.json';
import {navigateToESSLandingPage, uploadfile, uploadValidCSVFile, uploadValidTXTFile, uploadValidAndInvalidCSVFile, uploadvalidandInvalidTXTFile, uploadFileOtherThanCSVorTXT, uploadValidAndDuplicateCSVFile, uploadValidAndDuplicateTXTFile, addENCnumbers}from '../../Helper/ESSLandingPageHelper';
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

     //Test Case 13809
     test('Verify that the user is able to upload a .csv file only', async({page})=>{
          await uploadValidCSVFile(page);
          await page.pause();
          await expect(page.locator(esslandingpageObjectsConfig.chooseuploadfileoptionSelector)).toContainText('.csv')
     })

     //Test Case 13815
     test('Verify clicking on Upload button, Upload permit.txt file successfully', async({page})=>{
          await uploadValidTXTFile(page);
          await expect (page.locator(esslandingpageObjectsConfig.chooseuploadfileoptionSelector)).toContainText('.txt');

     })

     //Test Case 13810
     test('Verify a error message if user tries to upload other than allowed files (.csv & permit file (.txt) )', async({page})=>{
          await  uploadFileOtherThanCSVorTXT(page);
          await expect(page.locator(esslandingpageObjectsConfig.errorMessageSelector)).toContainText('Please select a .csv or .txt')
     })
    
     //Test Case 13811
     test('Upload CSV file and verify ENC uploaded', async({page})=>{
          await uploadValidAndInvalidCSVFile(page);
          await expect(page.locator(esslandingpageObjectsConfig.errorMessageExcludeENCsSelector)).toContainText(esslandingpageObjectsConfig.messageForOverlimitAndInvalidENCs)
     })

     //Test Case 13817
     test('Upload TXT file and verify ENC uploaded', async({page})=>{
          await uploadvalidandInvalidTXTFile(page);
          await expect (page.locator(esslandingpageObjectsConfig.errorMessageExcludeENCsSelector)).toContainText(esslandingpageObjectsConfig.messageForOverlimitAndInvalidENCs)
     })

     //Test Case 13823
     test('Verify uploading valid duplicate ENC Number to Upload list for CSV File.', async({page})=>{
          await uploadValidAndDuplicateCSVFile(page);
          await expect(page.locator(esslandingpageObjectsConfig.errorMessageExcludeENCsSelector)).toContainText(esslandingpageObjectsConfig.messageForOverlimitAndInvalidENCs)
     })

     //Test Case 13826
     test.only ('Verify uploading valid duplicate ENC Number to Upload list for TXT File.', async({page})=>{
          await uploadValidAndDuplicateTXTFile(page);
          await expect (page.locator(esslandingpageObjectsConfig.errorMessageExcludeENCsSelector)).toContainText(esslandingpageObjectsConfig.messageForOverlimitAndInvalidENCs)
     })
});

