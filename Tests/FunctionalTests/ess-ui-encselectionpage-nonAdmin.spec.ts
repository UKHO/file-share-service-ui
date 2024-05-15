import { test, expect } from '@playwright/test';
import { autoTestConfig } from '../../appSetting.json';
import { AcceptCookies, LoginPortal } from '../../Helper/CommonHelper';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { EssLandingPageObjects } from '../../PageObjects/essui-landingpageObjects';
import { EncSelectionPageObjects } from '../../PageObjects/essui-encselectionpageObjects';
import { ExchangeSetSelectionPageObjects } from '../../PageObjects/essui-exchangesetselectionpageObjects';

test.describe('ESS UI ENCs Selection Page Functional Test Scenarios for Non Admin users', () => {

  let esslandingPageObjects: EssLandingPageObjects;
  let encSelectionPageObjects: EncSelectionPageObjects;
  let exchangeSetSelectionPageObjects: ExchangeSetSelectionPageObjects;

  test.beforeEach(async ({ page }) => {
    esslandingPageObjects = new EssLandingPageObjects(page);
    encSelectionPageObjects = new EncSelectionPageObjects(page);
    exchangeSetSelectionPageObjects = new ExchangeSetSelectionPageObjects(page);
    await page.goto(autoTestConfig.url);
    await page.waitForLoadState('load');
    await AcceptCookies(page);
    await LoginPortal(page, autoTestConfig.nonAdminUser, autoTestConfig.password);
    await page.locator(fssHomePageObjectsConfig.essLinkSelector).getByText(fssHomePageObjectsConfig.essLinkText).click();    
  })  

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156061
  test("check user is not able to see options to choose preferred exchange set format on 'Confirm exchange set content​' screen for Base exchange set @NonUKHOUser",async ({ page}) =>{
    await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    await esslandingPageObjects.uploadradiobtnSelectorClick();
    await esslandingPageObjects.uploadFile(page, './Tests/TestData/ENCs_Sorting.csv');
    await esslandingPageObjects.proceedButtonSelectorClick();
    await encSelectionPageObjects.selectAllSelectorClick();
    encSelectionPageObjects.expect.toBeTruthy(await encSelectionPageObjects.s63Radiobutton.isHidden());
    encSelectionPageObjects.expect.toBeTruthy(await encSelectionPageObjects.s57Radiobutton.isHidden());
  });  

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156212
  test("check user is not able to see options to choose preferred exchange set format on 'Confirm exchange set content' screen for Delta exchange set @NonUKHOUser",async ({ page}) =>{
    await exchangeSetSelectionPageObjects.enterDate(new Date());
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    await esslandingPageObjects.uploadradiobtnSelectorClick();
    await esslandingPageObjects.uploadFile(page, './Tests/TestData/Delta.csv');
    await esslandingPageObjects.proceedButtonSelectorClick(); 
    await encSelectionPageObjects.selectAllSelectorClick();
    encSelectionPageObjects.expect.toBeTruthy(await encSelectionPageObjects.s63Radiobutton.isHidden());
    encSelectionPageObjects.expect.toBeTruthy(await encSelectionPageObjects.s57Radiobutton.isHidden());
  });
});