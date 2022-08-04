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

    test('Veriy "Search" link is not available on home page before login', async ({ page }) => {
        expect (await page.isHidden (fssHomePageObjectsConfig.searchLinkSelector)).toBeTruthy();
      
    });

    test('Veriy "Exchange sets" link is not available on home page before login', async ({ page }) => {
        expect (await page.isHidden (fssHomePageObjectsConfig.essLinkSelector)).toBeTruthy();          
    });

    test('Veriy clicking Search link from home page after login, navigates to Search page', async ({ page }) => {
        await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await page.locator(fssHomePageObjectsConfig.searchLinkSelector).click();
        await page.waitForLoadState('load');
        expect(await page.innerHTML(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(fssSearchPageObjectsConfig.searchPageContainerHeaderText);      
    });

    test('Veriy clicking Exchange sets link after login navigates to ESS laanding page', async ({ page }) => {
        await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await page.locator(fssHomePageObjectsConfig.essLinkSelector).click();
        await page.waitForLoadState('load');
       // await expect(page).toHaveURL("https://fss-dev.admiralty.co.uk/#/exchangesets");
       await expect(page).toHaveTitle("Admiralty - File Share Service - Exchange Sets"); 
        expect(await page.innerText(esslandingpageObjectsConfig.radioButtonNameSelector)).toEqual(esslandingpageObjectsConfig.radioButtonName);
    });

    test('Veriy appending "/search" in  url after login, navigates to Search page', async ({ page }) => {
        await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await page.goto(autoTestConfig.url+"#"+"/search");
        await page.waitForLoadState('load');
        expect(await page.innerHTML(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(fssSearchPageObjectsConfig.searchPageContainerHeaderText); 
      
    });

    test('Veriy appending "/exchangesets" in  url after login, navigates to ESS laanding page', async ({ page }) => {
        await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await page.goto(autoTestConfig.url+"/#"+"/exchangesets");
        await page.waitForLoadState('load');
        await page.waitForTimeout(3000);
        expect(await page.innerText(esslandingpageObjectsConfig.radioButtonNameSelector)).toEqual(esslandingpageObjectsConfig.radioButtonName);
    });    
});