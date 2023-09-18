import { test, expect } from '@playwright/test';
import { autoTestConfig } from '../../appSetting.json';
import { commonObjectsConfig } from '../../PageObjects/commonObjects.json';
import { fssSearchPageObjectsConfig } from '../../PageObjects/fss-searchpageObjects.json';
import { AcceptCookies,LoginPortal } from '../../Helper/CommonHelper';
import { ClickWaitRetry, SearchAttribute} from '../../Helper/SearchPageHelper';
import { stringOperatorList, symbolOperatorListForFileSize, symbolOperatorListForDate } from '../../Helper/ConstantHelper'

test.describe('FSS UI Search Page Functional Test Scenarios', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(autoTestConfig.url);
    await page.waitForLoadState();
    await AcceptCookies(page);
    await LoginPortal(page, autoTestConfig.user, autoTestConfig.password);
    await page.waitForSelector(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector);
    expect(await page.innerHTML(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(fssSearchPageObjectsConfig.searchPageContainerHeaderText);
    await page.waitForTimeout(2000);
    await page.click(fssSearchPageObjectsConfig.advancedSearchLinkSelector, { force: true });
  });

  test('Does it display "Simplified Search" link on advanced Search page', async ({ page }) => {
    await page.waitForSelector(fssSearchPageObjectsConfig.simplifiedSearchLinkSelector);

    var simplifiedSearchLink = await page.innerText(fssSearchPageObjectsConfig.simplifiedSearchLinkSelector);
    expect(simplifiedSearchLink).toEqual(fssSearchPageObjectsConfig.simplifiedSearchLinkText);
  });

  test('Verify if click search button without selecting a field value', async ( {page}) => {
    //await ClickWaitRetry(page, fssSearchPageObjectsConfig.searchAttributeButton, fssSearchPageObjectsConfig.dialogInfoSelector);
    await page.getByTestId('adv-search-button').click();
    const maxtime = Date.now() + 20000;
    while (Date.now() < maxtime) {
      if (await page.locator(fssSearchPageObjectsConfig.dialogTitleSelector).textContent() === fssSearchPageObjectsConfig.warningMessageValue) {
        break;
      }
      else {
        await ClickWaitRetry(page, fssSearchPageObjectsConfig.searchAttributeButton, fssSearchPageObjectsConfig.dialogInfoSelector);
      }
    }

    var errorMessage = await page.innerText(fssSearchPageObjectsConfig.dialogTitleSelector);
    expect(errorMessage).toContain(fssSearchPageObjectsConfig.warningMessageValue);

  })

  test('Verify Operator dropdown contains correct values when "BusinessUnit" attribute field selected', async ({ page }) => {
    await SearchAttribute(page, "BusinessUnit");
    const operatorsOption = await page.$$eval(fssSearchPageObjectsConfig.operatorDropDownItemsSelector, options => { return options.map(option => option.textContent) });
    var match = (stringOperatorList.length == operatorsOption.length) && stringOperatorList.every(function (element, index) {
      return element === operatorsOption[index];
    });

    expect(match).toBeTruthy();

  })

  test('Verify Operator dropdown contains correct values when "FileSize" attribute field selected', async ({ page }) => {
    await SearchAttribute(page, "FileSize");
    const operatorsOption = await page.$$eval(fssSearchPageObjectsConfig.operatorDropDownItemsSelector, options => { return options.map(option => option.textContent) });
    var match = (symbolOperatorListForFileSize.length == operatorsOption.length) && symbolOperatorListForFileSize.every(function (element, index) {
      return element === operatorsOption[index];
    });

    expect(match).toBeTruthy();

  })

  test('Verify Operator dropdown contains correct values when "FileName" attribute field selected', async ({ page }) => {
    await SearchAttribute(page, "FileName");
    const operatorsOption = await page.$$eval(fssSearchPageObjectsConfig.operatorDropDownItemsSelector, options => { return options.map(option => option.textContent) });
    var match = (stringOperatorList.length == operatorsOption.length) && stringOperatorList.every(function (element, index) {
      return element === operatorsOption[index];
    });

    expect(match).toBeTruthy();

  })

  test('Verify Operator dropdown contains correct values when "MimeType" attribute field selected', async ({ page }) => {
    await SearchAttribute(page, "MimeType");
    const operatorsOption = await page.$$eval(fssSearchPageObjectsConfig.operatorDropDownItemsSelector, options => { return options.map(option => option.textContent) });
    var match = (stringOperatorList.length == operatorsOption.length) && stringOperatorList.every(function (element, index) {
      return element === operatorsOption[index];
    });
    expect(match).toBeTruthy();
  })

  test('Verify Operator dropdown contains correct values when "BatchExpiryDate" attribute field selected', async ({ page }) => {
    await SearchAttribute(page, "BatchExpiryDate");
    const operatorsOption = await page.$$eval(fssSearchPageObjectsConfig.operatorDropDownItemsSelector, options => { return options.map(option => option.textContent) });
    var match = (symbolOperatorListForDate.length == operatorsOption.length) && symbolOperatorListForDate.every(function (element, index) {
      return element === operatorsOption[index];
    });
    expect(match).toBeTruthy();
  })

  test('Verify Operator dropdown contains correct values when "BatchPublishedDate" attribute field selected', async ({ page }) => {

    await SearchAttribute(page, "BatchPublishedDate");
    const operatorsOption = await page.$$eval(fssSearchPageObjectsConfig.operatorDropDownItemsSelector, options => { return options.map(option => option.textContent) });
    var match = (symbolOperatorListForDate.length == operatorsOption.length) && symbolOperatorListForDate.every(function (element, index) {
      return element === operatorsOption[index];
    });
    expect(match).toBeTruthy();

  })

  test('Verify when "BusinessUnit" attribute field selected, input value field change to "text" type', async ({ page }) => {
    await SearchAttribute(page, "BusinessUnit");
    const inputValueFieldAttribute = await page.getAttribute(fssSearchPageObjectsConfig.inputSearchValueSelector, "type");
    expect(inputValueFieldAttribute).toEqual("text");
  })

  test('Verify when "FileSize" attribute field selected, input value field change to "tel" type', async ({ page }) => {
    await SearchAttribute(page, "FileSize");
    const inputValueFieldAttribute = await page.getAttribute(fssSearchPageObjectsConfig.inputSearchValueSelector, "type");
    expect(inputValueFieldAttribute).toEqual("tel");
  })

  test('Verify when "BatchPublishedDate" attribute field selected, input value field change to "date" type', async ({ page }) => {

    await SearchAttribute(page, "BatchPublishedDate");
    const inputValueFieldAttribute = await page.getAttribute(fssSearchPageObjectsConfig.inputSearchValueSelector, "type");
    expect(inputValueFieldAttribute).toEqual("date");
  })

  test('When click on "Add new line" button a new row added to the query table', async ({ page }) => {
    await page.waitForSelector(fssSearchPageObjectsConfig.inputSearchFieldSelector);
    let tableRows = (await page.$$(fssSearchPageObjectsConfig.searchQueryTableRowSelector)).length;
    expect(tableRows).toEqual(1);

    //add new row
    await page.click(".addNewLine");
    tableRows = (await page.$$(fssSearchPageObjectsConfig.searchQueryTableRowSelector)).length;
    expect(tableRows).toEqual(2);
  })

  test('When click on "Delete" button a row deleted from the query table', async ({ page }) => {
    await page.waitForSelector(fssSearchPageObjectsConfig.inputSearchFieldSelector);
    await page.click(".addNewLine");
    let tableRows = (await page.$$(fssSearchPageObjectsConfig.searchQueryTableRowSelector)).length;
    expect(tableRows).toEqual(2);

    //delete a row
    await page.click(".deleteRow");
    tableRows = (await page.$$(fssSearchPageObjectsConfig.searchQueryTableRowSelector)).length;
    expect(tableRows).toEqual(1);
  })
});
