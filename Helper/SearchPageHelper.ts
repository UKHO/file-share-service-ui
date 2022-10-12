import { Page, expect } from '@playwright/test';
import { fssSearchPageObjectsConfig } from '../PageObjects/fss-searchpageObjects.json';

// clickwaitRetry

export async function ClickWaitRetry(page: Page, buttonToClick: string, selectorToWaitFor: string,
    timeout: number = 30000, step: number = 1000) {
    const maxtime = Date.now() + timeout;
    let success = false;
  
    while (Date.now() < maxtime && !success) {
      await page.click(buttonToClick);
  
      try {
        await page.waitForSelector(selectorToWaitFor, { timeout: step });
        success = true;
      } catch (error) {
      }
    }
  
    if (!success) {
      throw Error("Couldn't load (" + selectorToWaitFor + ") after pressing (" + buttonToClick + ")");
    }
  }

  //<summary>
// Search attribute on FSS UI
//</summary>
//<param> page Object </param>
//<param> attributeName </param>

export async function SearchAttribute(page: Page, attributeName: string) {
    await page.waitForSelector(fssSearchPageObjectsConfig.inputSearchFieldSelector);
    await page.fill(fssSearchPageObjectsConfig.inputSearchFieldSelector, "");
    await page.fill(fssSearchPageObjectsConfig.inputSearchFieldSelector, attributeName);
    await page.keyboard.press('Backspace');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForLoadState('domcontentloaded');
  }

  export async function SearchAttributeSecondRow(page: Page, attributeName: string) {
    await page.fill(fssSearchPageObjectsConfig.inputSearchFieldSelectorSecondRow, "");
    await page.fill(fssSearchPageObjectsConfig.inputSearchFieldSelectorSecondRow, attributeName);
    await page.keyboard.press('Backspace');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForLoadState('domcontentloaded');
  }
  
  //<summary>
  // Get the file Size in bytes.
  //</summary>
  //<param> filesize </param>
  
  export function GetFileSizeInBytes(fileSize: string) {
    const [digits, units] = fileSize.split(' ');
    const digitsInt = parseInt(digits, 10);
  
    switch (units) {
      case 'KB':
        return digitsInt * 1024;
      case 'MB':
        return digitsInt * 1024 * 1024;
      case 'GB':
        return digitsInt * 1024 * 1024 * 1024;
    }
  
    return digitsInt;
  }
  
  export function TryGetFileSizeInBytes(fileSize: string): number | null {
    const regex = /^\S+\s(B|KB|MB|GB)$/;
  
    if (fileSize.match(regex)) {
      return GetFileSizeInBytes(fileSize);
    }
  
    return null;
  }
  
  
  export function DataCollectionComparison(collectionSource: any, collectionTarget: any) {
    let checkFlag = false;
    for (let index = 0; index < collectionSource.length; index++) {
      for (let ba = 0; ba < collectionTarget.length; ba++) {
        if (collectionSource[index].toLowerCase().includes(collectionTarget[ba].toLowerCase())) {
          checkFlag = true;
          break;
        }
      }
      if (checkFlag == false) {
        break;
      }
    }
  
    return checkFlag;
  }
  
  export async function InsertSearchText(page: Page, searchBatchAttribute: string) {
    await page.waitForTimeout(2000);
    await page.fill(fssSearchPageObjectsConfig.inputSimplifiedSearchBoxSelector, "");
    await page.fill(fssSearchPageObjectsConfig.inputSimplifiedSearchBoxSelector, searchBatchAttribute);
    await page.waitForTimeout(2000);
    await page.click(fssSearchPageObjectsConfig.simplifiedSearchButtonSelector);
    await page.waitForTimeout(2000);
  
  }
  export async function ExpectAllResultsHaveBatchUserAttValue(
    page: Page, preciseValue: string): Promise<void> {
  
    await ExpectSelectionsAreEqual(page,
      `//table[@class='${fssSearchPageObjectsConfig.searchAttributeTable.substring(1)}']`,
      `//table[@class='${fssSearchPageObjectsConfig.searchAttributeTable.substring(1)}' and 0 < count(.//td[translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='${preciseValue.toLowerCase()}'])]`);
  }
  
  export async function ExpectAllResultsContainBatchUserAttValue(
    page: Page, containsValue: string): Promise<void> {
  
    await ExpectSelectionsAreEqual(page,
      `//table[@class='${fssSearchPageObjectsConfig.searchAttributeTable.substring(1)}']`,
      `//table[@class='${fssSearchPageObjectsConfig.searchAttributeTable.substring(1)}' and 0 < count(.//td[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${containsValue.toLowerCase()}')])]`);
  }
  
  export async function ExpectAllResultsContainAnyBatchUserAttValue(
    page: Page, containsOneOf: string[]): Promise<void> {
  
    expect(containsOneOf.length).toBeTruthy();
  
    const tdPredicate = containsOneOf
      .map(containsValue => `contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${containsValue.toLowerCase()}')`)
      .join(' or ');
  
    await ExpectSelectionsAreEqual(page,
      `//table[@class='${fssSearchPageObjectsConfig.searchAttributeTable.substring(1)}']`,
      `//table[@class='${fssSearchPageObjectsConfig.searchAttributeTable.substring(1)}' and 0 < count(.//td[${tdPredicate}])]`);
  }

  export async function ExpectAllResultsContainAnyBatchUserAndFileNameAttValue(
    page: Page, containsOneOf: string[]): Promise<void> {
  
    expect(containsOneOf.length).toBeTruthy();
  
    const tdPredicate = containsOneOf
      .map(containsValue => `contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${containsValue.toLowerCase()}')`)
      .join(' or ');
  
    await ExpectSelectionsAreEqualforBatchAndFile(page,
      `//table[@class='${fssSearchPageObjectsConfig.searchAttributeTable.substring(1)}']`,
      `//table[@class='${fssSearchPageObjectsConfig.searchAttributeTable.substring(1)}' and 0 < count(.//td[${tdPredicate}])]`,
      `${fssSearchPageObjectsConfig.fileAttributeTableFileNameSelector}`
      );
  }
  
  export async function ExpectAllResultsHaveFileAttributeValue(
    page: Page, preciseValue: string): Promise<void> {
  
    await ExpectSelectionsAreEqual(page,
      `//table[@class='${fssSearchPageObjectsConfig.fileAttributeTable.substring(1)}']`,
      `//table[@class='${fssSearchPageObjectsConfig.fileAttributeTable.substring(1)}' and 0 < count(.//td[translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='${preciseValue.toLowerCase()}'])]`);
  }
  
  async function ExpectSelectionsAreEqual(page: Page, tablePath: string, tablePathWithCondition: string): Promise<void> {
   await page.waitForTimeout(3000);
   //  count the result rows
    const resultCount = await page.$$eval(tablePath, matches => matches.length);
     
    // fail if there are no matching selections
    expect(resultCount).toBeTruthy();
     
    // count the result rows with the attribute value
    const withValueCount = await page.$$eval(tablePathWithCondition, matches => matches.length);
  
    // assert all the resulting batches have the attribute value
    expect(withValueCount).toEqual(resultCount);
  }

  async function ExpectSelectionsAreEqualforBatchAndFile(page: Page, tablePath: string, tablePathWithCondition: string, 
    filePath: string): Promise<void> {
   await page.waitForTimeout(3000);
   //  count the result rows
    const resultCount = await page.$$eval(tablePath, matches => matches.length);
     
    // fail if there are no matching selections
    expect(resultCount).toBeTruthy();
     
    // count the result rows with the attribute value
     const withValueCount = await page.$$eval(tablePathWithCondition, matches => matches.length);

     const withFileNameCount = await page.$$eval(filePath, matches => matches.length);

     const withBothValueCount = withValueCount + withFileNameCount;
  
     // assert all the resulting batches have the attribute value
     expect(withBothValueCount).toBeGreaterThanOrEqual(resultCount);
  }
  
  export async function GetTotalResultCount(page: Page): Promise<number> {
    const totalResult = await page.innerText(fssSearchPageObjectsConfig.totalResultCountSelector);
    return parseInt(totalResult.split(' ')[0], 10);
  }

  export async function GetCountOfBatchRows(page: Page): Promise<number> {
    //  count the result rows
    return await page.$$eval(`//table[@class='${fssSearchPageObjectsConfig.searchAttributeTable.substring(1)}']`, matches => matches.length);
  }

  export async function ExpectSpecificColumnValueDisplayed(page: Page, tablecloumnName: string, tablecloumnValue: string): Promise<void> {

    while (true) {
      //count the result rows
      const resultCount = await page.$$eval(`//table[@class='${fssSearchPageObjectsConfig.searchAttributeTable.substring(1)}']`, matches => matches.length);
  
      //fail if there are no matching selections
      expect(resultCount).toBeTruthy();
  
      let attributeFieldCount = 0;
      for (let rc = 0; rc < resultCount; rc++) {
        const tablepath = `(//table[@class='${fssSearchPageObjectsConfig.searchAttributeTable.substring(1)}'])[${rc + 1}]//tr`
        let colnum = await GetColumnNumber(page, tablepath, tablecloumnName);
       if(colnum!="")
       {
        let data=colnum.split('_');
        expect(await page.locator(`(//table[@class='${fssSearchPageObjectsConfig.searchAttributeTable.substring(1)}'])[${rc + 1}]//tr[${data[0]}]//td[${data[1]}]`).textContent()).toEqual(tablecloumnValue);
       }
       attributeFieldCount = attributeFieldCount + 1;
  
      }
  
      // assert all the resulting batches have the attribute value
      expect(attributeFieldCount).toEqual(resultCount);
  
      //if next page paginator link is disable break the infinite loop
      if (await page.locator(fssSearchPageObjectsConfig.paginatorLinkNextDisabled).isVisible()) {
        break;
      }
      else {
        await page.click(fssSearchPageObjectsConfig.paginatorLinkNext);
        await page.waitForTimeout(2000);
      }
    }
  
  }

  export async function filterCheckBox(batchAtributeType: string, batchAttributeValue: string): Promise<string> {

    let checkBoxMatch = `//ukho-expansion[.//h3[text()='${batchAtributeType}']]//ukho-checkbox/label[text()='${batchAttributeValue}']`;
    return checkBoxMatch;      
  }

  async function GetColumnNumber(page: Page, tablePath: string, columnHeaderText: string) {
    let colIndex = "";
    const rowCount = await page.$$eval(tablePath, matches => matches.length);
     for (let row = 1; row <= rowCount; row++) {
      const resultColCount = await page.$$eval(`${tablePath}[${row}]`+'//th', matches => matches.length); 
      for (let col = 1;  col<=resultColCount; col++) 
      {       
      if (await page.locator(`${tablePath}[${row}]`+'//th'+`[${col}]`).textContent() === columnHeaderText) {
        return row+1+"_"+col;
      }
    }
  }
    return colIndex;
  }

  export async function GetSpecificAttributeCount(page: Page, batchAtributeType: string, batchAttributeValue: string): Promise<number> {

    let searchString = `//ukho-expansion[.//h3[text()='${batchAtributeType}']]//ukho-checkbox/label[text()='${batchAttributeValue}']`
    const resultCount = await page.$$eval(searchString, matches => matches.length);
    return resultCount
  
  }
  