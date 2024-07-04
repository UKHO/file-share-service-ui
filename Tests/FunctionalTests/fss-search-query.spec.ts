import { test, expect } from '@playwright/test';
import { autoTestConfig } from '../../appSetting.json';
import { fssSearchPageObjectsConfig } from '../../PageObjects/fss-searchpageObjects.json';
import {AcceptCookies, LoginPortal} from '../../Helper/CommonHelper';
import {SearchAttribute, SearchAttributeSecondRow, 
  ExpectAllResultsHaveBatchUserAttValue,
  ExpectAllResultsContainBatchUserAttValue,
  GetTotalResultCount, AdmiraltyExpectAllResultsHaveFileAttributeValue,
  GetCountOfBatchRows,AdmiraltyGetFileSizeCount} from '../../Helper/SearchPageHelper';
import { attributeProductType, attributeMimeType, attributeBusinessUnit, attributeFileSize, attributeWeekYear} from '../../Helper/ConstantHelper';

const searchQuerySqlInjection = "adds''; drop table BatchAttribute";
const batchAttributeSpecialChar = '/';

test.describe('Test Search Query Scenario On Search Page', () => {

  test.beforeEach(async ( {page}) => {
    await page.goto(autoTestConfig.url);
    await AcceptCookies(page);
    await LoginPortal(page,autoTestConfig.user, autoTestConfig.password);
    await page.waitForSelector(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector);
    expect(await page.innerHTML(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector))
        .toEqual(fssSearchPageObjectsConfig.searchPageContainerHeaderText);
        await page.waitForTimeout(2000);
    await page.click(fssSearchPageObjectsConfig.advancedSearchLinkSelector, {force: true});
  });

  test('Batch Attribute table returns correct product on attribute search', async ({ page }) => {
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, "eq");
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, attributeProductType.value);
    await page.getByTestId('adv-search-button').click();
    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);
  });

  test('Batch Attribute table returns correct product on special characters search', async ({ page }) => {
    await page.waitForTimeout(2000);
    await SearchAttribute(page, attributeWeekYear);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, "contains");     
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, batchAttributeSpecialChar);

    await page.getByTestId('adv-search-button').click();
    await ExpectAllResultsContainBatchUserAttValue(page, batchAttributeSpecialChar);
  });

  test('Batch Attribute table returns correct values on multiple attributes search', async ({ page }) => {
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, "eq");     
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, attributeProductType.value);
    await page.click(fssSearchPageObjectsConfig.buttonAddNewRow);
    await SearchAttributeSecondRow(page, attributeMimeType.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelectorSecondRow, "eq");     
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelectorSecondRow, attributeMimeType.value);
    await page.getByTestId('adv-search-button').click();
    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);
    await AdmiraltyExpectAllResultsHaveFileAttributeValue(page, attributeMimeType.value);
  });

  test('Test to verify grouping button is disabled', async ({ page }) => {    
    const groupingBeforeAriaDisabled=await page.getAttribute(fssSearchPageObjectsConfig.groupingButton,"aria-disabled");
    expect(groupingBeforeAriaDisabled).toEqual("true");       
  });

  test('Test to verify no value field displayed when select operator eq null or ne null for BatchExpiryDate', async ({ page }) => {    
    await SearchAttribute(page,"BatchExpiryDate");
    //select operator eq null 
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector,"eq null");
    let valueField=await page.$$(fssSearchPageObjectsConfig.inputSearchValueSelector);
    expect(valueField.length).toEqual(0);

    //select operator ne null 
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector,"ne null");
    valueField=await page.$$(fssSearchPageObjectsConfig.inputSearchValueSelector);
    expect(valueField.length).toEqual(0); 
  });

  test('Test to verify no value field displayed when select operator eq null or ne null for BatchPublishedDate', async ({ page }) => {    
    await SearchAttribute(page,"BatchPublishedDate");
    //select operator eq null 
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector,"eq null");
    let valueField=await page.$$(fssSearchPageObjectsConfig.inputSearchValueSelector);
    expect(valueField.length).toEqual(0);

    //select operator ne null 
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector,"ne null");
    valueField=await page.$$(fssSearchPageObjectsConfig.inputSearchValueSelector);
    expect(valueField.length).toEqual(0);     
    
  });

  test('Test to verify no value field displayed when select operator eq null or ne null for batch attributes', async ({ page }) => {    
    await SearchAttribute(page, attributeProductType.key);
    //select operator eq null 
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector,"eq null");
    let valueField=await page.$$(fssSearchPageObjectsConfig.inputSearchValueSelector);
    expect(valueField.length).toEqual(0);
    //select operator ne null 
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector,"ne null");
    valueField=await page.$$(fssSearchPageObjectsConfig.inputSearchValueSelector);
    expect(valueField.length).toEqual(0);         
  });

  test('Test to verify pagination count for user attribute search', async ({ page }) => {    
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, "eq");     
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, attributeProductType.value);
    await page.getByTestId('adv-search-button').click();
    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);
    const resultCount = await GetCountOfBatchRows(page);        
    //Get the product counts on UI
    const paginatorText = await page.innerText(fssSearchPageObjectsConfig.paginatorPageCount);
    expect(paginatorText).toContain(`Showing 1-${resultCount}`);
    
  });

  test ('Test to verify file downloaded status changed after click on download button', async ({ page }) => {
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, "eq");
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, attributeProductType.value);
    await page.getByTestId('adv-search-button').click();
    // Click on expand button
    await page.click(fssSearchPageObjectsConfig.chooseFileDownloadSelector);
    // Click on download button
    await page.click(fssSearchPageObjectsConfig.fileDownloadButton, {force: true});
    // Get the file downloaded status
    const fileDownloadStatus = await page.getAttribute(fssSearchPageObjectsConfig.fileDownloadButtonStatus, "class");
    expect(fileDownloadStatus).toContain("check");
  });

  // rhz - disabled test due to issue with the test data
  // test('Batch Attribute table returns records less than filesize search', async ({ page }) => {    
  

  test('Test to verify no result for search query', async ({ page }) => {
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, 'eq');
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, 'L1K2');

    await page.getByTestId('adv-search-button').click();
    // Verify dialog info for no records
    const infoText = await page.locator(fssSearchPageObjectsConfig.dialogTitleSelector).innerText();
    expect(infoText).toEqual(fssSearchPageObjectsConfig.dialogInfoText);
  });

  test('Test to verify warning message for invalid field value', async ({ page }) => {
    await SearchAttribute(page, attributeFileSize.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, 'eq');
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, 'L1K2');
    await page.getByTestId('adv-search-button').click();
    // Verify warning message
    const warningMessage = await page.locator(fssSearchPageObjectsConfig.dialogTitleSelector).innerText();
    expect(warningMessage).toEqual(fssSearchPageObjectsConfig.dialogWarningText);
  });

  test('Test to verify no result for "Sql Injection" query', async ({ page }) => {
    await SearchAttribute(page, attributeBusinessUnit.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, 'eq');
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, searchQuerySqlInjection);
    await page.getByTestId('adv-search-button').click();
    // Verify dialog info for no records
    const infoText = await page.locator(fssSearchPageObjectsConfig.dialogTitleSelector).innerText();
    expect(infoText).toEqual(fssSearchPageObjectsConfig.dialogInfoText);
  });

});
