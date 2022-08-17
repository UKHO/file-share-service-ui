import {test,expect} from '@playwright/test';
import { AcceptCookies,LoginPortal } from '../../Helper/CommonHelper';
import { autoTestConfig } from '../../appSetting.json';
import { commonObjectsConfig } from '../../PageObjects/commonObjects.json';
import { fssSearchPageObjectsConfig } from '../../PageObjects/fss-searchpageObjects.json';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { esslandingpageObjectsConfig } from '../../PageObjects/essui-landingpageObjects.json';


test.describe('ESS UI Home Page Functional Test Scenarios', ()=>{

    test.beforeEach(async({page})=>{

        await page.goto(autoTestConfig.url);
        await page.waitForLoadState(); 
        await AcceptCookies(page);   
        })

    test('Verify "Search" link is not available on home page before login', async ({ page }) => {
        expect (await page.isHidden (fssHomePageObjectsConfig.searchLinkSelector)).toBeTruthy();
      
    });

    test('Verify "Exchange sets" link is not available on home page before login', async ({ page }) => {
        expect (await page.isHidden (fssHomePageObjectsConfig.essLinkSelector)).toBeTruthy();          
    });

    test('Verify clicking Search link from home page after login, navigates to Search page', async ({ page }) => {
        await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await page.locator(fssHomePageObjectsConfig.searchLinkSelector).click();
        await page.waitForLoadState('load');
        await expect(page).toHaveTitle("Admiralty - File Share Service - Search");
        expect(await page.innerHTML(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(fssSearchPageObjectsConfig.searchPageContainerHeaderText);      
    });

    test('Verify clicking Exchange sets link after login navigates to ESS landing page', async ({ page }) => {
        await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await page.locator(fssHomePageObjectsConfig.essLinkSelector).click();
        await page.waitForTimeout(500);
        await expect(page.url()).toContain("/exchangesets");
        await expect(page).toHaveTitle("Admiralty - File Share Service - Exchange Sets");        
    });

    test('Verify appending "/search" in  url after login, navigates to Search page', async ({ page }) => {
        await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await page.goto(autoTestConfig.url+"/#/search");
        await page.waitForLoadState('load');
        expect(await page.innerHTML(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(fssSearchPageObjectsConfig.searchPageContainerHeaderText); 
      
    });

    test('Verify appending "/exchangesets" in  url after login, navigates to ESS landing page', async ({ page }) => {
        await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await page.goto(autoTestConfig.url+"/#/exchangesets");
        await page.waitForLoadState('load');
        expect(await page.innerText(esslandingpageObjectsConfig.radioButtonNameSelector)).toEqual(esslandingpageObjectsConfig.radioButton1Name);
    });

    test('Verify appending "/exchangesets" in url before login, navigates to home page', async ({ page }) => {
        await page.goto(autoTestConfig.url+"/#/exchangesets");
        await expect(page).toHaveTitle("Admiralty - File Share Service");    
        expect (await page.isHidden (fssHomePageObjectsConfig.essLinkSelector)).toBeTruthy();   
    });
       
    test('Verify appending "/search" in url before login, navigates to home page', async ({ page }) => {
        await page.goto(autoTestConfig.url+"/#/search");
        await expect(page).toHaveTitle("Admiralty - File Share Service");    
        expect (await page.isHidden (fssHomePageObjectsConfig.searchLinkSelector)).toBeTruthy();   
    });

});