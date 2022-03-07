const { autoTestConfig } = require('./appSetting');
const { pageObjectsConfig, pageTimeOut } = require('./pageObjects');
import {SearchAttribute, SearchAttributeSecondRow, ClickWaitRetry, TryGetFileSizeInBytes,
  AcceptCookies, ExpectAllResultsHaveBatchUserAttValue,
  ExpectAllResultsContainBatchUserAttValue,
  ExpectAllResultsHaveFileAttributeValue, GetTotalResultCount,
  GetCountOfBatchRows} from './helpermethod';
import { attributeProductType, attributeMimeType, attributeBusinessUnit, attributeFileSize, searchNonExistBatchAttribute} from './helperconstant';

const searchQuerySqlInjection = "adds''; drop table BatchAttribute";
const batchAttributeSpecialChar = '$£';

describe('Test Search Query Scenario On Search Page', () => {
  jest.setTimeout(pageTimeOut.timeOutInMilliSeconds);

  beforeEach(async () => {
    await page.goto(autoTestConfig.url);
    await AcceptCookies(page);

    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);
    expect(await page.innerHTML(pageObjectsConfig.searchPageContainerHeaderSelector))
        .toEqual(pageObjectsConfig.searchPageContainerHeaderText);
  });

  it('Batch Attribute table returns correct product on attribute search', async () => {
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector, "eq");
    await page.fill(pageObjectsConfig.inputSearchValueSelector, attributeProductType.value);

    await ClickWaitRetry(page, pageObjectsConfig.searchAttributeButton, pageObjectsConfig.searchAttributeTable);
    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);
  });

  it('Batch Attribute table returns correct product on special characters search', async () => {
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector, "contains");     
    await page.fill(pageObjectsConfig.inputSearchValueSelector, batchAttributeSpecialChar);

    await ClickWaitRetry(page, pageObjectsConfig.searchAttributeButton, pageObjectsConfig.searchAttributeTable);
    await ExpectAllResultsContainBatchUserAttValue(page, batchAttributeSpecialChar);
  });

  it('Batch Attribute table returns correct values on multiple attributes search', async () => {
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector, "eq");     
    await page.fill(pageObjectsConfig.inputSearchValueSelector, attributeProductType.value);
    await page.click(pageObjectsConfig.buttonAddNewRow);

    await SearchAttributeSecondRow(page, attributeMimeType.key);
    await page.selectOption(pageObjectsConfig.operatorDropDownSelectorSecondRow, "eq");     
    await page.fill(pageObjectsConfig.inputSearchValueSelectorSecondRow, attributeMimeType.value);

    await ClickWaitRetry(page, pageObjectsConfig.searchAttributeButton, pageObjectsConfig.searchAttributeTable);
    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);
    await ExpectAllResultsHaveFileAttributeValue(page, attributeMimeType.value);

  });

  it('Test to verify grouping button is disabled', async () => {    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    const groupingBeforeAriaDisabled=await page.getAttribute(pageObjectsConfig.groupingButton,"aria-disabled");
    expect(groupingBeforeAriaDisabled).toEqual("true");   
    
  });

  it('Test to verify no value field displayed when select operator eq null or ne null for BatchExpiryDate', async () => {    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page,"BatchExpiryDate");
    //select operator eq null 
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"eq null");
    let valueField=await page.$$(pageObjectsConfig.inputSearchValueSelector);
    expect(valueField.length).toEqual(0);

    //select operator ne null 
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"ne null");
    valueField=await page.$$(pageObjectsConfig.inputSearchValueSelector);
    expect(valueField.length).toEqual(0); 
  });

  it('Test to verify no value field displayed when select operator eq null or ne null for BatchPublishedDate', async () => {    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page,"BatchPublishedDate");
    //select operator eq null 
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"eq null");
    let valueField=await page.$$(pageObjectsConfig.inputSearchValueSelector);
    expect(valueField.length).toEqual(0);

    //select operator ne null 
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"ne null");
    valueField=await page.$$(pageObjectsConfig.inputSearchValueSelector);
    expect(valueField.length).toEqual(0);     
    
  });

  it('Test to verify no value field displayed when select operator eq null or ne null for batch attributes', async () => {    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, attributeProductType.key);
    //select operator eq null 
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"eq null");
    let valueField=await page.$$(pageObjectsConfig.inputSearchValueSelector);
    expect(valueField.length).toEqual(0);

    //select operator ne null 
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"ne null");
    valueField=await page.$$(pageObjectsConfig.inputSearchValueSelector);
    expect(valueField.length).toEqual(0);     
    
  });

  it('Test to verify pagination count for user attribute search', async () => {    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector, "eq");     
    await page.fill(pageObjectsConfig.inputSearchValueSelector, attributeProductType.value);

    await ClickWaitRetry(page, pageObjectsConfig.searchAttributeButton, pageObjectsConfig.searchAttributeTable);
    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);
    const resultCount = await GetCountOfBatchRows(page);
        
    //Get the product counts on UI
    const paginatorText=await page.innerText(pageObjectsConfig.paginatorSelector);
    expect(paginatorText).toContain(`Showing 1-${resultCount}`);
    
  });

  it('Test to verify file downloaded status changed after click on download button', async () => {
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector, "eq");
    await page.fill(pageObjectsConfig.inputSearchValueSelector, attributeProductType.value);

    await ClickWaitRetry(page, pageObjectsConfig.searchAttributeButton, pageObjectsConfig.searchAttributeTable);

    // Click on expand button
    await page.click(pageObjectsConfig.chooseFileDownloadSelector);

    // Click on download button
    await page.click(pageObjectsConfig.fileDownloadButton);

    // Get the file downloaded status
    const fileDownloadStatus = await page.getAttribute(pageObjectsConfig.fileDownloadButtonStatus, "class");
    expect(fileDownloadStatus).toContain("check");
  });

  it('Batch Attribute table returns records less than filesize search', async () => {    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector, 'eq');     
    await page.fill(pageObjectsConfig.inputSearchValueSelector, attributeProductType.value);
      
    await ClickWaitRetry(page, pageObjectsConfig.searchAttributeButton, pageObjectsConfig.searchAttributeTable);
    const countWithoutFileSizeFilter = await GetTotalResultCount(page);
    expect(countWithoutFileSizeFilter).toBeTruthy();

    await page.click(pageObjectsConfig.buttonAddNewRow);
    await SearchAttributeSecondRow(page, attributeFileSize.key);
    await page.selectOption(pageObjectsConfig.operatorDropDownSelectorSecondRow, 'lt');
    await page.fill(pageObjectsConfig.inputSearchValueSelectorSecondRow, attributeFileSize.value);

    await ClickWaitRetry(page, pageObjectsConfig.searchAttributeButton, pageObjectsConfig.searchAttributeTable);
    const countWithFileSizeFilter = await GetTotalResultCount(page);
    expect(countWithFileSizeFilter).toBeTruthy();
    expect(countWithFileSizeFilter).toBeLessThan(countWithoutFileSizeFilter);

    // get all the file attribute tables (one per batch)
    const fileAttTables = await page.$$(`//table[@class='${pageObjectsConfig.fileAttributeTable.substring(1)}']`);
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

  it('Test to verify no result for search query', async () => {
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector, 'eq');
    await page.fill(pageObjectsConfig.inputSearchValueSelector, 'L1K2');

    await ClickWaitRetry(page, pageObjectsConfig.searchAttributeButton, pageObjectsConfig.dialogInfoSelector);

    // Verify dialog info for no records
    const infoText = await page.innerText(pageObjectsConfig.dialogInfoSelector);

    expect(infoText).toEqual(pageObjectsConfig.dialogInfoText);

  });

  it('Test to verify warning message for invalid field value', async () => {
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, attributeFileSize.key);
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector, 'eq');
    await page.fill(pageObjectsConfig.inputSearchValueSelector, 'L1K2');

    await ClickWaitRetry(page, pageObjectsConfig.searchAttributeButton, pageObjectsConfig.dialogWarningSelector);

    // Verify warning message
    const warningMessage = await page.innerText(pageObjectsConfig.dialogWarningSelector);

    expect(warningMessage).toEqual(pageObjectsConfig.dialogWarningText);

  });

  it('Test to verify no result for "Sql Injection" query', async () => {
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, attributeBusinessUnit.key);
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector, 'eq');
    await page.fill(pageObjectsConfig.inputSearchValueSelector, searchQuerySqlInjection);

    await ClickWaitRetry(page, pageObjectsConfig.searchAttributeButton, pageObjectsConfig.dialogInfoSelector);

    // Verify dialog info for no records
    const infoText = await page.innerText(pageObjectsConfig.dialogInfoSelector);

    expect(infoText).toEqual(pageObjectsConfig.dialogInfoText);

  });

});
