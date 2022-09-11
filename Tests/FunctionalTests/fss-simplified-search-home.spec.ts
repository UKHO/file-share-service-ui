import { test, expect } from '@playwright/test';
import { autoTestConfig } from '../../appSetting.json';
import { commonObjectsConfig } from '../../PageObjects/commonObjects';
import { fssSearchPageObjectsConfig } from '../../PageObjects/fss-searchpageObjects';
import { AcceptCookies, LoginPortal } from '../../Helper/CommonHelper';

test.describe('Test Search Attribute Scenario On Simplified Search Page', () => {
  
  test.beforeEach(async ({ page }) => {
      await page.goto(autoTestConfig.url)
      await AcceptCookies(page);
      await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
      await page.waitForSelector(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector);
      expect(await page.innerHTML(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(fssSearchPageObjectsConfig.searchPageContainerHeaderText);
  })

  test('Verify user landed on "Simplified Search" page', async ({ page }) => {
       
    var simplifiedSearchBox= (await page.$$(fssSearchPageObjectsConfig.inputSimplifiedSearchBoxSelector)).length
    expect(simplifiedSearchBox).toEqual(1);
    var advanceSearchElements =(await page.$$("#fss-querytable-field-1 input,fss-querytable-operator-1 select,#fss-querytable-value-1 input")).length
    expect(advanceSearchElements).toEqual(0);
  })

  test('Does it display "Advanced Search" link on Simplified Search page', async ({ page }) => {
    var advancedSearchLink = await page.innerText(fssSearchPageObjectsConfig.advancedSearchLinkSelector);
    expect(advancedSearchLink).toEqual(fssSearchPageObjectsConfig.advancedSearchLink);
  })

  test('Does it display "Error message" if user clicks on search button and simplified search box is empty', async ({ page }) => {
    await page.waitForSelector(fssSearchPageObjectsConfig.inputSimplifiedSearchBoxSelector);
    await page.click(fssSearchPageObjectsConfig.simplifiedSearchButtonSelector);
    var errorMessage = await page.innerText(fssSearchPageObjectsConfig.dialogWarningSelector);
    expect(errorMessage).toContain(fssSearchPageObjectsConfig.warningMessageValue);
  }) 

  test('Verify user clicks on "Advanced Search" link navigates to Advanced Search page', async ({ page }) => {
    await page.waitForSelector(fssSearchPageObjectsConfig.advancedSearchLinkSelector);
    await page.click(fssSearchPageObjectsConfig.advancedSearchLinkSelector, {force: true});
    await page.waitForSelector(fssSearchPageObjectsConfig.advancedSearchAddLineSelector);
    await page.click(fssSearchPageObjectsConfig.advancedSearchAddLineSelector);
    await page.waitForSelector(fssSearchPageObjectsConfig.advancedSearchTableSelector);   
    //search box for simplified search is not present on advanced search page.
    var simplifiedSearchBox= (await page.$$(fssSearchPageObjectsConfig.inputSimplifiedSearchBoxSelector)).length
    expect(simplifiedSearchBox).toEqual(0);
    
  })
})