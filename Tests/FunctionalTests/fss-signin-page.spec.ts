import { test, expect } from '@playwright/test';
import { autoTestConfig } from '../../appSetting.json';
import { commonObjectsConfig } from '../../PageObjects/commonObjects.json';
import { fssSearchPageObjectsConfig } from '../../PageObjects/fss-searchpageObjects.json';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { AcceptCookies, LoginPortal } from '../../Helper/CommonHelper';

test.describe('Test Sign In Page Scenario', () => {
  
  test.beforeEach(async ( {page}) => {    
    await page.goto(autoTestConfig.url)
    await AcceptCookies(page);
  })

   test('User clicks Sign in link with valid credentials should display FullName after login successfully', async ({ page }) => {

    await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
    await page.waitForSelector(commonObjectsConfig.loginAccountSelector);
    expect(await page.innerHTML(commonObjectsConfig.loginAccountLinkSelector)).toContain(autoTestConfig.userFullName);

  })

  
  test('User clicks Sign in link with valid credentials should navigate to search page after login successfully', async ({ page }) => {

    await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
    await page.waitForSelector(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector);
    expect(await page.innerHTML(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(fssSearchPageObjectsConfig.searchPageContainerHeaderText);

  })
  
    test('User clicks on Sign in link and close the popup window user navigate to fss home page', async ({ page }) => {
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.click(commonObjectsConfig.loginSignInLinkSelector)
    ]);
    popup.close();
    await page.waitForSelector(fssHomePageObjectsConfig.homePageSignInHeaderInfoSelector);
    expect(await page.innerHTML(fssHomePageObjectsConfig.homePageSignInHeaderInfoSelector)).toEqual(fssHomePageObjectsConfig.homePageSignInHeaderInfoText);

  })
}) 