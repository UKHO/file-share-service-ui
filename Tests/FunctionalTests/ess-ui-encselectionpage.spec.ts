import {test, expect, Page, chromium} from '@playwright/test';
import {esslandingpageObjectsConfig} from '../../PageObjects/essui-landingpageObjects.json';
import {fssHomePageObjectsConfig} from '../../PageObjects/fss-homepageObjects.json';
import {encselectionpageObjectsConfig} from '../../PageObjects/essui-encselectionpageObjects.json';
import {autoTestConfig} from '../../appSetting.json';
import {LoginPortal} from '../../Helper/CommonHelper';
import {addAnotherENC, addSingleENC} from '../../Helper/ESSLandingPageHelper';
import {commonObjectsConfig} from '../../PageObjects/commonObjects.json';


test.describe('ESS UI Landing Page Functional Test Scenarios', ()=>{

     test.beforeEach(async({page})=>{
     
        await page.goto(autoTestConfig.url);
        await page.waitForLoadState('load');
        await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await page.locator(fssHomePageObjectsConfig.essLinkSelector).click();
     })


     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13944 (For valid ENC no.)
     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13945 (For "Your selection" table)
     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13946 (For "Start again" link)
     test.only('Verify that user is able to add a valid single ENCs and link "Start Again" redirects to ESS landing page', async({page})=>{
      await addSingleENC(page, esslandingpageObjectsConfig.addSingleENCTextboxSelector);
      expect(await page.innerText(encselectionpageObjectsConfig.firstEncSelector)).toEqual(esslandingpageObjectsConfig.ENCValue2);
      await expect(page.locator(esslandingpageObjectsConfig.selectionTextSelector)).toBeVisible();
      await page.click(esslandingpageObjectsConfig.startAgainLinkSelector);
      await expect(page.locator(esslandingpageObjectsConfig.exchangesettextSelector)).toBeVisible();
 })

     // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13957
     test('Verify that user is not able to add more than Maxlimit ENCs using manually adding ENcs', async({page})=>{
      await addSingleENC(page, esslandingpageObjectsConfig.addSingleENCTextboxSelector);
      await page.locator(encselectionpageObjectsConfig.addAnotherENCSelector).click();
})

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13954 - Add Anther ENC
    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13956 - Duplicate ENC
     test('Verify that after clicking on "Add another ENC" link user able to add another ENC number', async({page})=>{
       await addSingleENC(page, esslandingpageObjectsConfig.addSingleENCTextboxSelector);
       await page.locator(encselectionpageObjectsConfig.addAnotherENCSelector).click(); 
       await expect (page.locator(encselectionpageObjectsConfig.addAnotherENCSelector)).toBeVisible();

       await page.locator(encselectionpageObjectsConfig.typeENCCellNameHereSelector).fill(encselectionpageObjectsConfig.ENCValue1);
       await page.locator(esslandingpageObjectsConfig.addsingleencSelector).click(); 
       await expect (page.locator(encselectionpageObjectsConfig.addAnotherENC2Selector)).toBeVisible();
      
       //Add another ENC2
       await addAnotherENC(page, encselectionpageObjectsConfig.addAnotherENCSelector);
       await expect (page.locator(encselectionpageObjectsConfig.addAnotherENCSelector)).toBeVisible();
       await expect (page.locator(encselectionpageObjectsConfig.addAnotherENC3Selector)).toBeVisible();
       expect (await page.isChecked(encselectionpageObjectsConfig.chooseBoxSelecetor)).toBeFalsy();

       //13956 - Add another ENC2 - Duplicate No.
       await addAnotherENC(page, encselectionpageObjectsConfig.addAnotherENCSelector);
       await expect (page.locator(encselectionpageObjectsConfig.addAnotherENCSelector)).toBeVisible();
       await expect (page.locator(encselectionpageObjectsConfig.addAnotherENC3Selector)).toBeVisible();
       await expect (page.locator(encselectionpageObjectsConfig.errorMessageForDplicateNumberSelector)).toContainText(encselectionpageObjectsConfig.errorMessage)
  })


})