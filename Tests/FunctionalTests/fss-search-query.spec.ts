import { test, expect } from '@playwright/test';
import { autoTestConfig } from '../../appSetting.json';
import { commonObjectsConfig } from '../../PageObjects/commonObjects.json';
import { fssSearchPageObjectsConfig } from '../../PageObjects/fss-searchpageObjects.json';
import {AcceptCookies, LoginPortal} from '../../Helper/CommonHelper';
import {SearchAttribute, SearchAttributeSecondRow, ClickWaitRetry, TryGetFileSizeInBytes
  , ExpectAllResultsHaveBatchUserAttValue,
  ExpectAllResultsContainBatchUserAttValue,
  ExpectAllResultsHaveFileAttributeValue, GetTotalResultCount,
  GetCountOfBatchRows} from '../../Helper/SearchPageHelper';
import { attributeProductType, attributeMimeType, attributeBusinessUnit, attributeFileSize, searchNonExistBatchAttribute} from '../../Helper/ConstantHelper';

const searchQuerySqlInjection = "adds''; drop table BatchAttribute";
const batchAttributeSpecialChar = '$£';

test.describe('Test Search Query Scenario On Search Page', () => {
  //jest.setTimeout(pageTimeOut.timeOutInMilliSeconds);

  test.beforeEach(async ( {page}) => {
    await page.goto(autoTestConfig.url);
    await AcceptCookies(page);
    await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
    await page.waitForSelector(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector);
    expect(await page.innerHTML(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector))
        .toEqual(fssSearchPageObjectsConfig.searchPageContainerHeaderText);
    await page.click(fssSearchPageObjectsConfig.advancedSearchLinkSelector, {force: true});
  });

  test('Batch Attribute table returns correct product on attribute search', async ({ page }) => {
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, "eq");
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, attributeProductType.value);

    await ClickWaitRetry(page, fssSearchPageObjectsConfig.searchAttributeButton, fssSearchPageObjectsConfig.searchAttributeTable);
    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);
  });

  test('Batch Attribute table returns correct product on special characters search', async ({ page }) => {
   // page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, "contains");     
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, batchAttributeSpecialChar);

    await ClickWaitRetry(page, fssSearchPageObjectsConfig.searchAttributeButton, fssSearchPageObjectsConfig.searchAttributeTable);
    await ExpectAllResultsContainBatchUserAttValue(page, batchAttributeSpecialChar);
  });

  test('Batch Attribute table returns correct values on multiple attributes search', async ({ page }) => {
   // page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, "eq");     
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, attributeProductType.value);
    await page.click(fssSearchPageObjectsConfig.buttonAddNewRow);

    await SearchAttributeSecondRow(page, attributeMimeType.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelectorSecondRow, "eq");     
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelectorSecondRow, attributeMimeType.value);

    await ClickWaitRetry(page, fssSearchPageObjectsConfig.searchAttributeButton, fssSearchPageObjectsConfig.searchAttributeTable);
    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);
    await ExpectAllResultsHaveFileAttributeValue(page, attributeMimeType.value);

  });

  test('Test to verify grouping button is disabled', async ({ page }) => {    
   // page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    const groupingBeforeAriaDisabled=await page.getAttribute(fssSearchPageObjectsConfig.groupingButton,"aria-disabled");
    expect(groupingBeforeAriaDisabled).toEqual("true");   
    
  });

  test('Test to verify no value field displayed when select operator eq null or ne null for BatchExpiryDate', async ({ page }) => {    
   // page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
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
    //page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
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
    //page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
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
    //page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, "eq");     
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, attributeProductType.value);

    await ClickWaitRetry(page, fssSearchPageObjectsConfig.searchAttributeButton, fssSearchPageObjectsConfig.searchAttributeTable);
    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);
    const resultCount = await GetCountOfBatchRows(page);
        
    //Get the product counts on UI
    const paginatorText=await page.innerText(fssSearchPageObjectsConfig.paginatorSelector);
    expect(paginatorText).toContain(`Showing 1-${resultCount}`);
    
  });

  test('Test to verify file downloaded status changed after click on download button', async ({ page }) => {
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, "eq");
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, attributeProductType.value);

    await ClickWaitRetry(page, fssSearchPageObjectsConfig.searchAttributeButton, fssSearchPageObjectsConfig.searchAttributeTable);

    // Click on expand button
    await page.click(fssSearchPageObjectsConfig.chooseFileDownloadSelector);

    // Click on download button
    await page.click(fssSearchPageObjectsConfig.fileDownloadButton, {force: true});

    // Get the file downloaded status
    const fileDownloadStatus = await page.getAttribute(fssSearchPageObjectsConfig.fileDownloadButtonStatus, "class");
    expect(fileDownloadStatus).toContain("check");
  });

  test('Batch Attribute table returns records less than filesize search', async ({ page }) => {    
   // page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, 'eq');     
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, attributeProductType.value);
      
    await ClickWaitRetry(page, fssSearchPageObjectsConfig.searchAttributeButton, fssSearchPageObjectsConfig.searchAttributeTable);
    const countWithoutFileSizeFilter = await GetTotalResultCount(page);
    expect(countWithoutFileSizeFilter).toBeTruthy();

    await page.click(fssSearchPageObjectsConfig.buttonAddNewRow);
    await SearchAttributeSecondRow(page, attributeFileSize.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelectorSecondRow, 'lt');
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelectorSecondRow, attributeFileSize.value);

    await ClickWaitRetry(page, fssSearchPageObjectsConfig.searchAttributeButton, fssSearchPageObjectsConfig.searchAttributeTable);
    const countWithFileSizeFilter = await GetTotalResultCount(page);
    expect(countWithFileSizeFilter).toBeTruthy();
    expect(countWithFileSizeFilter).toBeLessThan(countWithoutFileSizeFilter);

    // get all the file attribute tables (one per batch)
    const fileAttTables = await page.$$(`//table[@class='${fssSearchPageObjectsConfig.fileAttributeTable.substring(1)}']`);
    expect(fileAttTables.length).toBeTruthy();

    const filterFileSize = parseInt(attributeFileSize.value, 10);

    // each table must contain at least one file smaller than the filter 
    for (const fileAttTable of fileAttTables) {
      const tds = await fileAttTable.$$eval('td', nodes => nodes.map(node => node.innerText));
      const fileCount = tds
          .filter(innerText => innerText)
          .map(innerText => TryGetFileSizeInBytes(innerText))
          .filter(fileSize => fileSize && fileSize < filterFileSize)
          .length;

      expect(fileCount).toBeTruthy();
    }
  });

  test('Test to verify no result for search query', async ({ page }) => {
   // page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, 'eq');
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, 'L1K2');

    await ClickWaitRetry(page, fssSearchPageObjectsConfig.searchAttributeButton, fssSearchPageObjectsConfig.dialogInfoSelector);

    // Verify dialog info for no records
    const infoText = await page.innerText(fssSearchPageObjectsConfig.dialogInfoSelector);

    expect(infoText).toEqual(fssSearchPageObjectsConfig.dialogInfoText);

  });

  test('Test to verify warning message for invalid field value', async ({ page }) => {
   // page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, attributeFileSize.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, 'eq');
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, 'L1K2');

    await ClickWaitRetry(page, fssSearchPageObjectsConfig.searchAttributeButton, fssSearchPageObjectsConfig.dialogWarningSelector);

    // Verify warning message
    const warningMessage = await page.innerText(fssSearchPageObjectsConfig.dialogWarningSelector);

    expect(warningMessage).toEqual(fssSearchPageObjectsConfig.dialogWarningText);

  });

  test('Test to verify no result for "Sql Injection" query', async ({ page }) => {
   // page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, attributeBusinessUnit.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, 'eq');
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, searchQuerySqlInjection);

    await ClickWaitRetry(page, fssSearchPageObjectsConfig.searchAttributeButton, fssSearchPageObjectsConfig.dialogInfoSelector);

    // Verify dialog info for no records
    const infoText = await page.innerText(fssSearchPageObjectsConfig.dialogInfoSelector);

    expect(infoText).toEqual(fssSearchPageObjectsConfig.dialogInfoText);

  });

});
