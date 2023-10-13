import { test, expect } from '@playwright/test';
import { autoTestConfig } from '../../appSetting.json';
import { AcceptCookies,LoginPortal } from '../../Helper/CommonHelper';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { EssLandingPageObjects } from '../../PageObjects/essui-landingpageObjects';
import { EncSelectionPageObjects } from '../../PageObjects/essui-encselectionpageObjects';

test.describe('ESS UI ENCs Selection Page Functional Test Scenarios', () => {

  let esslandingPageObjects: EssLandingPageObjects;
  let encSelectionPageObjects: EncSelectionPageObjects;

  test.beforeEach(async ({ page }) => {

    esslandingPageObjects = new EssLandingPageObjects(page);
    encSelectionPageObjects = new EncSelectionPageObjects(page);
    await page.goto(autoTestConfig.url);
    await page.waitForLoadState('load');
    await AcceptCookies(page);
    await LoginPortal(page, autoTestConfig.user, autoTestConfig.password);
    await page.locator(fssHomePageObjectsConfig.essLinkSelector).getByText(fssHomePageObjectsConfig.essLinkText).click();
    await esslandingPageObjects.uploadradiobtnSelectorClick();
    await esslandingPageObjects.uploadFile(page, './Tests/TestData/ENCs_Sorting.csv');
    await esslandingPageObjects.proceedButtonSelectorClick();

  })

  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13960
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13940
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13941
  test('Verify selecting and deselecting multiple checkboxes in left hand table, shows expected result in right hand table', async ({ page }) => {

    let encSelected = ['AU220150', 'CA271105', 'AU5PTL01']

    // To select ENCs
    await encSelectionPageObjects.expect.verifySelectedENCs(encSelected);
    //To deselect ENCs using checkbox
    await encSelectionPageObjects.expect.verifyDeselectedENCs(encSelected);
    // To deselect ENCs using "X" button.
    await encSelectionPageObjects.expect.verifyXButtonSelectorClick('AU220150');
  })

  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13961
  test('Check the functionality for Sorting of ENC numbers in ascending or descending order', async ({ page }) => {

    let ascOrderlist = ['AU220150', 'AU5PTL01', 'CA271105', 'CN484220', 'GB50184C']
    let dscOrderlist = ['GB50184C', 'CN484220', 'CA271105', 'AU5PTL01', 'AU220150']
    await encSelectionPageObjects.encNameSelectorClick();
    await encSelectionPageObjects.expect.verifyENCsSortOrder(ascOrderlist);
    await encSelectionPageObjects.encNameSelectorClick();
    await encSelectionPageObjects.expect.verifyENCsSortOrder(dscOrderlist);

  })

  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13962 (For verify Text)
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13959 (For verify Table as per ukho design)
  test('Verify Text on the top of ENC list.', async ({ page }) => {

    await encSelectionPageObjects.expect.startLinkSelectorVisible();
    await encSelectionPageObjects.expect.textAboveTableSelectorToEqual("Select up to 250 ENCs and make an exchange set");
  })

  

  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13944 (For valid ENC no.)
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13945 (For "Your selection" table)
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13946 (For "Start again" link)
  test('Verify that user is able to add a valid single ENCs and link "Start Again" redirects to ESS landing page', async ({ page }) => {
    await encSelectionPageObjects.startAgainLinkSelectorClick();
    await encSelectionPageObjects.addSingleENC("AU210130");
    await encSelectionPageObjects.expect.firstEncSelectorToEqual("AU210130");
    await encSelectionPageObjects.expect.selectionTextSelectorVisible();
    await encSelectionPageObjects.startAgainLinkSelectorClick();
    await esslandingPageObjects.expect.exchangesettextSelectorIsVisible();
  })

  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13954 - Add Anther ENC
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13956 - Duplicate ENC
  test('Verify that after clicking on "Add another ENC" link, user able to add another ENC number', async ({ page }) => {
    await encSelectionPageObjects.startAgainLinkSelectorClick();
    await encSelectionPageObjects.addSingleENC("AU210130");
    await encSelectionPageObjects.expect.addAnotherENCSelectorVisible();
    await encSelectionPageObjects.addAnotherENC("AU220150");
    await encSelectionPageObjects.expect.secondEncSelectorContainText("AU220150");
    await encSelectionPageObjects.expect.anotherCheckBoxSelectorChecked();

    //13956 - Add another ENC2 - Duplicate No.
    await encSelectionPageObjects.addAnotherENC("AU220150");
    await encSelectionPageObjects.expect.errorMessageForDuplicateNumberSelectorContainsText("ENC already in list.")
    await encSelectionPageObjects.expect.verifyLeftTableRowsCountSelectorCount(2);
  })

  // // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/13957
  test('Verify that user is not able to add more than Maxlimit (currently configured as 250) ENCs using manually adding ENC', async ({ page }) => {
    await encSelectionPageObjects.startAgainLinkSelectorClick();

    await esslandingPageObjects.uploadradiobtnSelectorClick();
    await esslandingPageObjects.uploadFile(page, './Tests/TestData/250ENCs.csv');
    await esslandingPageObjects.proceedButtonSelectorClick();

    //Adding ENC manually
    await encSelectionPageObjects.addAnotherENC("IN210101");

    await encSelectionPageObjects.expect.errorMsgMaxLimitSelectorContainText("Max ENC limit reached.");
  })

  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14112
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14113
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14114 
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14330
  test('Verify Count of uploaded & selected ENCs along with estimated size of Exchange set.', async ({ page }) => {
    let numberofENCs = await encSelectionPageObjects.ENCTableENClistCol1.count();
    await encSelectionPageObjects.selectAllSelector.click();
    await encSelectionPageObjects.expect.verifyNumberofENCs();
    await encSelectionPageObjects.expect.verifySizeofENCs(numberofENCs);

  })

  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14108
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14109
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14110
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14111 
  test('Verify Select all and Deselect all functionality', async ({ page }) => {

    // Select All link Visible bydefault
    await encSelectionPageObjects.expect.selectAllSelectorIsVisible();
    // Deselect All Visible
    await encSelectionPageObjects.selectAllSelectorClick();
    await encSelectionPageObjects.expect.deselectAllSelectorVisible();

    // Select All link Visible again
    await encSelectionPageObjects.deselectAllSelectorClick();
    await encSelectionPageObjects.expect.selectAllSelectorIsVisible();
    // Deselect All Visible when all the individual ENCs from left table selected
    const selectENCsFromTable = await encSelectionPageObjects.encTableCheckboxList;
    let numberOfENCs = await selectENCsFromTable.count();
    for (var i = 0; i < numberOfENCs; i++) {
      await selectENCsFromTable.nth(i).click();
    }
    await encSelectionPageObjects.expect.deselectAllSelectorVisible();
    // Select All link Visible when all the individual ENCs from left table de-selected
    for (var i = 0; i < numberOfENCs; i++) {
      await selectENCsFromTable.nth(i).click();
    }
    await encSelectionPageObjects.expect.selectAllSelectorIsVisible();
  })

  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14115
  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14116 
  test('Verify that selecting/deselecting individual ENCs does not affect select all/deselect all link', async ({ page }) => {

    await encSelectionPageObjects.startAgainLinkSelectorClick();
    await esslandingPageObjects.uploadradiobtnSelectorClick();
    await esslandingPageObjects.uploadFile(page, './Tests/TestData/100ENCs.txt');
    await esslandingPageObjects.proceedButtonSelectorClick();
    // Select All Visible & selecting individual ENCs
    await encSelectionPageObjects.firstCheckBoxSelectorClick();
    await encSelectionPageObjects.expect.selectAllSelectorIsVisible();
    // Deselect All Visible & deselecting individual ENCs
    await encSelectionPageObjects.selectAllSelectorClick();
    await encSelectionPageObjects.firstCheckBoxSelectorClick();
    await encSelectionPageObjects.expect.deselectAllSelectorVisible();

  })

})
