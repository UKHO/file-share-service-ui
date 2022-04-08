import { Page } from 'playwright';
const { pageObjectsConfig, pageTimeOut } = require('./pageObjects');

//<summary>
// Sign In to FSS UI using valid credentials
//</summary>
//<param> page Object </param>
//<param> userName </param>
//<param> password </param>
export async function LoginPortal(page: Page, userName: string, password: string, loginLink: string) {

  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.click(loginLink)
  ]);
  await popup.setViewportSize({ width: 800, height: 1024 });
  await popup.waitForLoadState();

  await popup.fill(pageObjectsConfig.loginPopupSignInEmailSelector, userName);
  await popup.click(pageObjectsConfig.loginPopupNextButtonSelector);
  await popup.fill(pageObjectsConfig.loginPopupSignInPasswordSelector, password);

  await popup.click(pageObjectsConfig.loginPopupSignInButtonSelector);

  await page.waitForNavigation();
}

//<summary>
// Search attribute on FSS UI
//</summary>
//<param> page Object </param>
//<param> attributeName </param>

export async function SearchAttribute(page: Page, attributeName: string)
{
  await page.fill(pageObjectsConfig.inputSearchFieldSelector, "");
  await page.fill(pageObjectsConfig.inputSearchFieldSelector, attributeName);
  await page.keyboard.press('Backspace');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForLoadState('domcontentloaded');
}

export async function SearchAttributeSecondRow(page:Page, attributeName: string)
{
  await page.fill(pageObjectsConfig.inputSearchFieldSelectorSecondRow,"");
  await page.fill(pageObjectsConfig.inputSearchFieldSelectorSecondRow,attributeName);
  await page.keyboard.press('Backspace');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter'); 
  await page.waitForLoadState('domcontentloaded');
}

//<summary>
// Get the file Size in bytes.
//</summary>
//<param> filesize </param>

export function GetFileSizeInBytes(fileSize: string)
{
  const [digits, units] = fileSize.split(' ');
  const digitsInt = parseInt(digits, 10);

  switch (units) {
    case 'KB':
      return digitsInt*1024;
    case 'MB':
      return digitsInt*1024*1024;
    case 'GB':
      return digitsInt*1024*1024*1024;
  }

  return digitsInt;
}

export function TryGetFileSizeInBytes(fileSize: string): number | null
{
  const regex = /^\S+\s(B|KB|MB|GB)$/;

  if (fileSize.match(regex)) {
    return GetFileSizeInBytes(fileSize);
  }

  return null;
}


export function DataCollectionComparison(collectionSource : any, collectionTarget : any)
{
  let checkFlag=false;
    for(let index=0; index<collectionSource.length; index++)
       {   
         for(let ba=0; ba<collectionTarget.length;ba++ )   
         {    
           if (collectionSource[index].toLowerCase().includes(collectionTarget[ba].toLowerCase()))
           {
            checkFlag=true;
            break;
           }    
          }  
          if(checkFlag==false)
          {
            break;
          }
       }  

       return checkFlag;
}

export async function InsertSearchText(page:Page,searchBatchAttribute :string) {
    await page.waitForTimeout(2000);
    await page.fill(pageObjectsConfig.inputSimplifiedSearchBoxSelector,"");  
    await page.fill(pageObjectsConfig.inputSimplifiedSearchBoxSelector,searchBatchAttribute);
    await page.waitForTimeout(2000);
    await page.click(pageObjectsConfig.simplifiedSearchButtonSelector);
    await page.waitForTimeout(1000);
  
}

export async function ClickWaitRetry(page: Page, buttonToClick: string, selectorToWaitFor: string,
                                     timeout: number = 30000, step: number = 1000){
  const maxtime = Date.now() + timeout;
  let success = false;

  while (Date.now() < maxtime && !success)
  {
    await page.click(buttonToClick);

    try {
      await page.waitForSelector(selectorToWaitFor, {timeout: step});
      success = true;
    } catch (error) {
    }
  }

  if (!success)
  {
    throw Error("Couldn't load (" + selectorToWaitFor +") after pressing (" + buttonToClick + ")");
  }
}

export async function ClickWaitRetryWarings(page: Page, buttonToClick: string, selectorToWaitFor: string, warningVal: string,
  timeout: number = 30000, step: number = 1000){
const maxtime = Date.now() + timeout;
let success = false;

while (Date.now() < maxtime && !success)
{
await page.click(buttonToClick);
if (await page.locator(selectorToWaitFor).textContent()==warningVal)
{
  success = true;
}
else{
  await page.waitForSelector(selectorToWaitFor, {timeout: step});
}
}
if (!success)
{
throw Error("Couldn't load (" + selectorToWaitFor +") after pressing (" + buttonToClick + ")");
}

}

export async function AcceptCookies(page: Page) {
  const maxtime = Date.now() + pageTimeOut.delay;
  const step = 500;
  let cookiesAccepted = false;

  // Some environments (but not all) need cookies to be accepted
  while (Date.now() < maxtime && !cookiesAccepted) {
    if (await page.locator(pageObjectsConfig.acceptCookieSelector).isVisible()) {
      await page.click(pageObjectsConfig.acceptCookieSelector);
      cookiesAccepted = true;
    }
    else {
      await page.waitForTimeout(step);
    }
  }
}

export async function ExpectAllResultsHaveBatchUserAttValue(
  page: Page, preciseValue: string): Promise<void> {

  await ExpectSelectionsAreEqual(page,
    `//table[@class='${pageObjectsConfig.searchAttributeTable.substring(1)}']`,
    `//table[@class='${pageObjectsConfig.searchAttributeTable.substring(1)}' and 0 < count(.//td[translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='${preciseValue.toLowerCase()}'])]`);
}

export async function ExpectAllResultsContainBatchUserAttValue(
  page: Page, containsValue: string): Promise<void> {

  await ExpectSelectionsAreEqual(page,
    `//table[@class='${pageObjectsConfig.searchAttributeTable.substring(1)}']`,
    `//table[@class='${pageObjectsConfig.searchAttributeTable.substring(1)}' and 0 < count(.//td[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${containsValue.toLowerCase()}')])]`);
}

export async function ExpectAllResultsContainAnyBatchUserAttValue(
  page: Page, containsOneOf: string[]): Promise<void>  {

  expect(containsOneOf.length).toBeTruthy();

  const tdPredicate = containsOneOf
    .map(containsValue => `contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${containsValue.toLowerCase()}')`)
    .join(' or ');

  await ExpectSelectionsAreEqual(page,
    `//table[@class='${pageObjectsConfig.searchAttributeTable.substring(1)}']`,
    `//table[@class='${pageObjectsConfig.searchAttributeTable.substring(1)}' and 0 < count(.//td[${tdPredicate}])]`);
}

export async function ExpectAllResultsHaveFileAttributeValue(
  page: Page, preciseValue: string): Promise<void> {

    await ExpectSelectionsAreEqual(page,
      `//table[@class='${pageObjectsConfig.fileAttributeTable.substring(1)}']`,
      `//table[@class='${pageObjectsConfig.fileAttributeTable.substring(1)}' and 0 < count(.//td[translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='${preciseValue.toLowerCase()}'])]`);
}

async function ExpectSelectionsAreEqual(page: Page, tablePath: string, tablePathWithCondition: string): Promise<void> {
  //  count the result rows
  const resultCount = await page.$$eval(tablePath, matches => matches.length);

  // fail if there are no matching selections
  expect(resultCount).toBeTruthy();

  // count the result rows with the attribute value
  const withValueCount = await page.$$eval(tablePathWithCondition, matches => matches.length);

  // assert all the resulting batches have the attribute value
  expect(withValueCount).toEqual(resultCount);
}

export async function GetTotalResultCount(page: Page): Promise<number>  {
  const totalResult = await page.innerText(pageObjectsConfig.totalResultCountSelector);
  return parseInt(totalResult.split(' ')[0], 10);
}

export async function GetCountOfBatchRows(page: Page): Promise<number> {
  //  count the result rows
  return await page.$$eval(`//table[@class='${pageObjectsConfig.searchAttributeTable.substring(1)}']`, matches => matches.length);
}

export async function GetSpecificAttributeCount(page: Page,batchAtributeType : string, batchAttributeValue : string) : Promise<number>{

  let searchString=`//ukho-expansion[.//h3[text()='${batchAtributeType}']]//ukho-checkbox/label[text()='${batchAttributeValue}']`
  const resultCount = await page.$$eval(searchString, matches => matches.length);
  return resultCount
  
}

export async function filterCheckBox(batchAtributeType: string, batchAttributeValue : string) : Promise<string>{
  
  let checkBoxMatch=`//ukho-expansion[.//h3[text()='${batchAtributeType}']]//ukho-checkbox/label[text()='${batchAttributeValue}']`;
  return checkBoxMatch;
 
}

export async function ExpectSpecificColumnValueDisplayed(page: Page, tablecloumnName: string, tablecloumnValue: string): Promise<void> {
  
  while(true)
  {
  //  count the result rows
  const resultCount = await page.$$eval(`//table[@class='${pageObjectsConfig.searchAttributeTable.substring(1)}']`, matches => matches.length);

  // fail if there are no matching selections
  expect(resultCount).toBeTruthy();

  let attributeFieldCount=0;
  for (let rc=0; rc<resultCount; rc++)
  {
     const tablepath=`(//table[@class='${pageObjectsConfig.searchAttributeTable.substring(1)}'])[${rc+1}]//tr//th`
     let colnum= await GetColumnNumber(page,tablepath,tablecloumnName);     
     expect(await page.locator(`(//table[@class='${pageObjectsConfig.searchAttributeTable.substring(1)}'])[${rc + 1}]//tr//td[${colnum}]`).textContent()).toEqual(tablecloumnValue);
     attributeFieldCount=attributeFieldCount+1;
    
  }
  
  // assert all the resulting batches have the attribute value
  expect(attributeFieldCount).toEqual(resultCount);

  //if next page paginator link is disable break the infinite loop
   if(await page.locator(pageObjectsConfig.paginatorLinkNextDisabled).isVisible())
   {
     break;
   }
   else
   {
      await page.click(pageObjectsConfig.paginatorLinkNext);
   }

 }

}

async function GetColumnNumber(page: Page,tablePath : string , columnHeaderText:string)
{
  let colIndex=0;
  const resultCount =await page.$$eval(tablePath, matches => matches.length);  
  for(let col=1; col<=resultCount;col++)
  {    
    if (await page.locator(`${tablePath}[${col}]`).textContent()==columnHeaderText)
    {
      colIndex=col;
      break;

    }
  }
   return colIndex;
} 


