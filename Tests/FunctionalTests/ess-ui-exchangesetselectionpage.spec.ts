import { test } from '@playwright/test';
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
  test('Verify the Exchange sets page', async ({ page }) => {
    await exchangeSetSelectionPageObjects.expect.validateBaseRadioButtonText();
    await exchangeSetSelectionPageObjects.expect.validateBaseDownloadDescription();
    await exchangeSetSelectionPageObjects.expect.validateDefaultSelection();
    await exchangeSetSelectionPageObjects.expect.validateDeltaRadioButtonText();
    await exchangeSetSelectionPageObjects.expect.validateDeltaDownloadDescription();
    await exchangeSetSelectionPageObjects.expect.validateDatePickerIsEmpty();
    await exchangeSetSelectionPageObjects.expect.validateProceedButton();
  });

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/146707
  test('Verify the Exchange sets page for Delta selection', async ({ page }) => {
    let date: Date = new Date();
    await exchangeSetSelectionPageObjects.enterDate(date);
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    await esslandingPageObjects.expect.addsingleencSelectorIsVisible();
  });

  //https://dev.azure.com/ukhydro/File%20Share%20Service/_workitems/edit/149007
  test('Verify the Exchange sets page for Base selection.', async ({ page }) => {
    await exchangeSetSelectionPageObjects.expect.validateProceedButton();
    await exchangeSetSelectionPageObjects.selectBaseDownloadRadioButton();
    await exchangeSetSelectionPageObjects.expect.validateDatePicker();
    await exchangeSetSelectionPageObjects.clickOnProceedButton();
    await esslandingPageObjects.expect.addsingleencSelectorIsVisible();
  });
})