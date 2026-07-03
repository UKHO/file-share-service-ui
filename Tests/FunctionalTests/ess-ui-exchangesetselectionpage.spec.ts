import { test, expect } from '@playwright/test';
import { autoTestConfig } from '../../appSetting.json';
import { AcceptCookies, LoginPortal } from '../../Helper/CommonHelper';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { EssLandingPageObjects } from '../../PageObjects/essui-landingpageObjects';
import { EncSelectionPageObjects } from '../../PageObjects/essui-encselectionpageObjects';
import { ExchangeSetSelectionPageObjects } from '../../PageObjects/essui-exchangesetselectionpageObjects';

test.describe('ESS UI Exchange Set Type Selection Page Functional Test Scenarios', () => {
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
    await LoginPortal(page, autoTestConfig.user, autoTestConfig.password);
    await page.locator(fssHomePageObjectsConfig.essLinkSelector).getByText(fssHomePageObjectsConfig.essLinkText).click();
  })

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/146695
  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156116
 test('Verify the Exchange sets page', async ({ page }) => {

    await expect(page.locator('#baseRadio').filter({ hasText: 'Download all data' })).toBeVisible();
    await expect(page.locator('#baseLabel').filter({ hasText: 'Select Download all data if you are installing base and all updates for specific ENCs or ADMIRALTY Information Overlay (AIO).'})).toBeVisible();
    
    await expect(page.locator('#deltaRadio').filter({ hasText: 'Download updates' })).toBeVisible();
    await expect(page.locator('#deltaLabel').filter({ hasText: 'Select Download updates to only receive updates for ENCs or AIO since your last update. This must be a date within the last 27 days.'})).toBeVisible();
    // if delta radio button is selected by default then date picker should be visible
    await expect(page.locator('.enc-datetime-container')).toBeVisible();
    
    await exchangeSetSelectionPageObjects.expect.validateDatePickerIsEmpty();
    await exchangeSetSelectionPageObjects.expect.validateProceedButton();
    await exchangeSetSelectionPageObjects.expect.validateHeaderText("Step 1 of 4\nChoose exchange set type");
  }); 

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/149497
  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/146707
  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/149499
  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/151753
  

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/149007
  test('Verify the Exchange sets page for Base selection.', async ({ page }) => {
    await exchangeSetSelectionPageObjects.expect.validateProceedButton();
    await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
    await exchangeSetSelectionPageObjects.expect.validateDatePicker();
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    await esslandingPageObjects.expect.addsingleencSelectorIsVisible();
  });

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/149506
  test('Verify start date selection from current date to 27 days in the past', async ({ page }) => {
    let date: Date = new Date();
    date.setDate(date.getDate() - 27);
    await exchangeSetSelectionPageObjects.enterDate(date);
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    await esslandingPageObjects.expect.addsingleencSelectorIsVisible();
  });

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/149509
  test('Verify start date selection from date picker when start date is selected as 20 days in the past', async ({ page }) => {
    let date: Date = new Date();
    date.setDate(date.getDate() - 20);
    await exchangeSetSelectionPageObjects.enterDate(date);
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    await esslandingPageObjects.expect.addsingleencSelectorIsVisible();
  });

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156359
  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/149507
  test('Verify warning message when selecting date as 28 days in the past from current date', async ({ page }) => {
    let date: Date = new Date();
    date.setDate(date.getDate() - 28);
    await exchangeSetSelectionPageObjects.enterDate(date);
    await exchangeSetSelectionPageObjects.expect.validateMessageForPastDate();
    await encSelectionPageObjects.expect.toBeTruthy(await exchangeSetSelectionPageObjects.proceed.isDisabled());
  });

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/156360
  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/149508
  test('Verify warning message when user selects future date', async ({ page }) => {
    let date: Date = new Date();
    date.setDate(date.getDate() + 1);
    await exchangeSetSelectionPageObjects.enterDate(date);
    await exchangeSetSelectionPageObjects.expect.validateMessageForFutureDate();
    await encSelectionPageObjects.expect.toBeTruthy(await exchangeSetSelectionPageObjects.proceed.isDisabled());
  });
})

