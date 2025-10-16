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
  await page.getByRole("textbox").fill(searchBatchAttribute);
  await page.getByTestId('sim-search-button').click();
  await page.waitForTimeout(2000);
}

export async function ExpectAllResultsHaveBatchUserAttValue(
  page: Page, preciseValue: string): Promise<void> {

  await  ExpectSelectionsAreEqual(page,fssSearchPageObjectsConfig.attributeTableSelector, preciseValue.toLowerCase());  
}

export async function ExpectAllResultsContainBatchUserAttValue(
  page: Page, containsValue: string): Promise<void> {

  await  ExpectSelectionsAreEqual(page,fssSearchPageObjectsConfig.attributeTableSelector, containsValue.toLowerCase()); 
}

export async function ExpectAllResultsContainAnyBatchUserAttValue(
  page: Page, containsOneOf: string[]): Promise<void> {

  expect(containsOneOf.length).toBeTruthy();

  await  ExpectSelectionsAreEqual(page,fssSearchPageObjectsConfig.attributeTableSelector,  containsOneOf);
  
}

export async function ExpectAllResultsContainAnyBatchUserAndFileNameAttValue(
  page: Page, containsOneOf: string[]): Promise<void> {

  expect(containsOneOf.length).toBeTruthy();

  await ExpectSelectionsAreEqualforBatchAndFile(page,
    fssSearchPageObjectsConfig.attributeTableSelector,  //rhz
    `//table[@class='${fssSearchPageObjectsConfig.fileAttributeTable.substring(1)}']`,
    containsOneOf
  );
}

export async function ExpectAllResultsHaveFileAttributeValue(
  page: Page, preciseValue: string): Promise<void> {

  await ExpectSelectionsAreEqual(page,
    `//admiralty-table[@role='table']`,
    `//admiralty-table[@role='table' and  .//admiralty-table-cell[contains(., '${preciseValue.toLowerCase()}')]]`); 
}

export async function AdmiraltyExpectAllResultsHaveFileAttributeValue(
  page: Page, preciseValue: string): Promise<void> {
  const admiraltyTables = await page.$$('admiralty-table');
  const filteredTables = await Promise.all(admiraltyTables.map(async (table) => {
    const cells = await table.$$('admiralty-table-cell');
    const hasTest = await Promise.all(cells.map(async (cell) => {
      const text = await cell.textContent();
      if (text != null) {
        return text.toLowerCase().includes(preciseValue.toLowerCase());
      } else {
        return false;
      }
    }));
    return hasTest.includes(true) ? table : null;
  }));

  const filteredTablesWithoutNulls = filteredTables.filter((table) => table !== null);

  expect(admiraltyTables.length).toEqual(filteredTablesWithoutNulls.length);
}


export async function AdmiraltyGetFileSizeCount(page: Page, fileSize: number) {
  const admiraltyTables = await page.$$('admiralty-table');
  const filteredTables = await Promise.all(admiraltyTables.map(async (table) => {
    const cells = await table.$$('admiralty-table-cell');
    const hasSize = await Promise.all(cells.map(async (cell) => {
      const text = await cell.textContent();
      let size = TryGetFileSizeInBytes(text);
      if (size != null && size > 0 && size < fileSize) {
        return size;
      } else {
        return 0;
      }
    }));
    const actual = hasSize.filter(itm => itm > 0);
    return actual.length;
  }));


  return filteredTables.reduce((accumulator, currentValue) => {
    return accumulator + currentValue
  }, 0);
}




async function ExpectSelectionsAreEqual(page: Page, selector: string, condition: string | string[]): Promise<void> {
  await page.waitForTimeout(3000);
  //  count the result rows
  const resultCount = await page.locator(selector).count(); //rhz

  // fail if there are no matching selections
  expect(resultCount).toBeTruthy();

  let tmpWithValueCount = 0;
  const tables = page.locator(selector);
  if (typeof condition === 'string') {
     tmpWithValueCount = await tables.filter({ has: page.locator('td', {hasText:condition})}).count();
  } else {
    for (const cond of condition) {
      tmpWithValueCount += await tables.filter({ has: page.locator('td', {hasText:cond})}).count();
    }
  }
  // count the result rows with the attribute value
  const withValueCount = tmpWithValueCount;
  
  // assert all the resulting batches have the attribute value
  expect(withValueCount).toEqual(resultCount);
}

async function ExpectSelectionsAreEqualforBatchAndFile(page: Page, selector: string, filePath: string, condition: string[]): Promise<void> {
    //Rhz Fix  
    await page.waitForTimeout(3000);
    let withValueCount = 0;
    let withFileNameCount = 0;

    //  count the result rows
    const resultCount = await page.locator(selector).count(); //rhz

    
    // fail if there are no matching selections
    expect(resultCount).toBeTruthy();
    
    const searchedBatchAttibutes = await page.locator(`${selector} tr td:first-child`).allTextContents(); 

    // count the result rows with the attribute value
    for (let rc = 0; rc < resultCount; rc++) {
      switch (true) {
        case (searchedBatchAttibutes[rc]?.includes(condition[0])):
          withValueCount = withValueCount + 1;
          break;
        case (searchedBatchAttibutes[rc]?.includes(condition[1])):
          withValueCount = withValueCount + 1;
          break;
         default :
           withFileNameCount = withFileNameCount + 1;
           break;
        
      }
    }

    const withBothValueCount = withValueCount + withFileNameCount;
    // assert all the resulting batches have the search value
    expect(withBothValueCount).toEqual(resultCount);
}


export async function GetTotalResultCount(page: Page): Promise<number> {
  const totalResult = await page.innerText(fssSearchPageObjectsConfig.totalResultCountSelector);
  return parseInt(totalResult.split(' ')[0], 10);
}

//Rhz we probably don't need this function
export async function GetCountOfBatchRowsXXRhz(page: Page): Promise<number> {
  //  count the result rows
  //return await page.$$eval(`//table[@class='${fssSearchPageObjectsConfig.searchAttributeTable.substring(1)}']`, matches => matches.length);
  return await page.locator(fssSearchPageObjectsConfig.attributeTableSelector).count(); //rhz
}

export async function ExpectSpecificColumnValueDisplayed(page: Page, tablecloumnName: string, tablecloumnValue: string): Promise<void> {
  //count the result rows
  const resultCount = await page.locator(fssSearchPageObjectsConfig.attributeTableSelector).count(); //

  //fail if there are no matching selections
  expect(resultCount).toBeTruthy();

  while (true) {

    let attributeFieldCount = 0;
    for (let rc = 0; rc < resultCount; rc++) {
      const table = page.locator(fssSearchPageObjectsConfig.attributeTableSelector).nth(rc);
      const headers = table.locator('tr th');

      let colnum = await GetColumnNumber(page, headers, tablecloumnName);
      expect(await table.locator(`tr td:nth-child(${colnum})`).textContent()).toEqual(tablecloumnValue);
      attributeFieldCount = attributeFieldCount + 1;
    }

    // assert all the resulting batches have the attribute value
    expect(attributeFieldCount).toEqual(resultCount);

    //if next page paginator link is disable break the infinite loop
    //it seems that playwright equates disabled to visible false
    const visibleState = await page.getByRole('button', { name: fssSearchPageObjectsConfig.paginatorLinkNext }).isVisible();
    if (!visibleState) {
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



async function GetColumnNumber(page: Page, tablePath: Locator, columnHeaderText: string) {
  let colIndex = 0;
  const resultCount = await tablePath.count();
  for (let col = 1; col <= resultCount; col++) {
    if (await tablePath.nth(col - 1).textContent() === columnHeaderText) {
      colIndex = col;
      break;

    }
  }
  return colIndex;
}

export async function GetSpecificAttributeCount(page: Page, batchAtributeType: string, batchAttributeValue: string): Promise<number> {

  let searchString = `//ukho-expansion[.//h3[text()='${batchAtributeType}']]//ukho-checkbox/label[text()='${batchAttributeValue}']`
  const resultCount = await page.$$eval(searchString, matches => matches.length);
  return resultCount

}
