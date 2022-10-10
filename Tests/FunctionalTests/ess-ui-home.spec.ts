import { test, expect } from '@playwright/test';
import { AcceptCookies, LoginPortal } from '../../Helper/CommonHelper';
import { autoTestConfig } from '../../appSetting.json';
import { commonObjectsConfig } from '../../PageObjects/commonObjects.json';
import { fssSearchPageObjectsConfig } from '../../PageObjects/fss-searchpageObjects.json';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { EssLandingPageObjects } from '../../PageObjects/essui-landingpageObjects';


test.describe('ESS UI Home Page Functional Test Scenarios', () => {

    let esslandingPageObjects: EssLandingPageObjects;

    test.beforeEach(async ({ page }) => {

        esslandingPageObjects = new EssLandingPageObjects(page);
        await page.goto(autoTestConfig.url);
        await page.waitForLoadState();
        await AcceptCookies(page);
    })

    test('Verify "Search" link is not available on home page before login', async ({ page }) => {
        expect(await page.isHidden(fssHomePageObjectsConfig.searchLinkSelector)).toBeTruthy();

    });

    test('Verify "Exchange sets" link is not available on home page before login', async ({ page }) => {
        expect(await page.isHidden(fssHomePageObjectsConfig.essLinkSelector)).toBeTruthy();
    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13803
    test('Verify clicking Search link from home page after login, navigates to Search page', async ({ page }) => {
        await LoginPortal(page, autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await page.locator(fssHomePageObjectsConfig.searchLinkSelector).click();
        await page.waitForLoadState('load');
        await expect(page).toHaveTitle("Admiralty - File Share Service - Search");
        expect(await page.innerHTML(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(fssSearchPageObjectsConfig.searchPageContainerHeaderText);
    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13796
    test('Verify clicking Exchange sets link after login navigates to ESS landing page', async ({ page }) => {
        await LoginPortal(page, autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await page.locator(fssHomePageObjectsConfig.essLinkSelector).click();
        await page.waitForTimeout(500);
        await expect(page.url()).toContain("/exchangesets");
        await expect(page).toHaveTitle("Admiralty - File Share Service - Exchange Sets");
    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13803
    test('Verify appending "/search" in  url after login, navigates to Search page', async ({ page }) => {
        await LoginPortal(page, autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await page.goto(autoTestConfig.url + "/#/search");
        await page.waitForLoadState('load');
        expect(await page.innerHTML(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(fssSearchPageObjectsConfig.searchPageContainerHeaderText);

    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13796
    test.only('Verify appending "/exchangesets" in  url after login, navigates to ESS landing page', async ({ page }) => {
        await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await page.goto(autoTestConfig.url+"/#/exchangesets");
        await page.waitForLoadState('load');
        await esslandingPageObjects.expect.verifyUploadRadioButtonName("Upload a list in a file");
        
    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13795
    test('Verify appending "/exchangesets" in url before login, navigates to home page', async ({ page }) => {
        await page.goto(autoTestConfig.url + "/#/exchangesets");
        await expect(page).toHaveTitle("Admiralty - File Share Service");
        expect(await page.isHidden(fssHomePageObjectsConfig.essLinkSelector)).toBeTruthy();
    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13797   
    test('Verify appending "/search" in url before login, navigates to home page', async ({ page }) => {
        await page.goto(autoTestConfig.url + "/#/search");
        await expect(page).toHaveTitle("Admiralty - File Share Service");
        expect(await page.isHidden(fssHomePageObjectsConfig.searchLinkSelector)).toBeTruthy();
    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13964
    test('Verfying Exchange Set Text and "Make an exchange set" Link from Search Page, redirect to ESS UI landing page ', async ({ page }) => {
        await LoginPortal(page, autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await expect(page.locator(fssHomePageObjectsConfig.exchngSetTextSelector)).toHaveText('Exchange sets');
        await expect(page.locator(fssHomePageObjectsConfig.exchngSetLinkSelector)).toHaveText('Make an exchange set');
        await page.locator(fssHomePageObjectsConfig.exchngSetLinkSelector).click();
        await page.waitForTimeout(500);
        await expect(page.url()).toContain("/exchangesets");
        await expect(page).toHaveTitle("Admiralty - File Share Service - Exchange Sets");
    });

   // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14225 (SPRINT-5)
   test ('Verify clicking on "logout" button page redirect to home page and "login" button is enabled' , async ({ page }) => {
    await LoginPortal(page, autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
    await page.locator(fssHomePageObjectsConfig.yourAccountSelector).hover();
    await page.locator(fssHomePageObjectsConfig.logOutBtnSelector).click();
    await page.waitForLoadState('load');
    expect(await page.isEnabled(fssHomePageObjectsConfig.signinLinkSelector)).toBeTruthy();
})

});