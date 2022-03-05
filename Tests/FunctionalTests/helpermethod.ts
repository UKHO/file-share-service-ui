import { Page } from 'playwright';
const { pageObjectsConfig, pageTimeOut } = require('./pageObjects');
let fileSizeInBytes: any;

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

  export function  GetFileSizeInBytes(fileSize: string)
  {
        let fileSizeChar=fileSize.split(' ');       
        
        switch (fileSizeChar[1]) {
          case "KB":
            fileSizeInBytes=parseInt(fileSizeChar[0])*1024;
            break;
          case "MB":
            fileSizeInBytes=parseInt(fileSizeChar[0])*1024*1024;
            break;
          case "GB":
              fileSizeInBytes=parseInt(fileSizeChar[0])*1024*1024*1024
            break;
          }
        
      return fileSizeInBytes; 
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

export async function ExpectAllResultsHaveBatchAttributeValue(
  page: Page, preciseValue: string): Promise<number> {

  return await ExpectAllResultsBatchAttributeValue(page,
    `//table[@class='attribute-table' and 0 < count(.//td[translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='${preciseValue.toLowerCase()}'])]`);
}

export async function ExpectAllResultsContainBatchAttributeValue(
  page: Page, containsValue: string): Promise<number> {

  return await ExpectAllResultsBatchAttributeValue(page,
    `//table[@class='attribute-table' and 0 < count(.//td[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${containsValue.toLowerCase()}')])]`);
}

export async function ExpectAllResultsContainOneBatchAttributeValue(
  page: Page, containsOneOf: string[]): Promise<number> {

  expect(containsOneOf.length).toBeTruthy();

  const tdPredicate = containsOneOf
    .map(containsValue => `contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${containsValue.toLowerCase()}')`)
    .join(' or ');

  return await ExpectAllResultsBatchAttributeValue(page,
    `//table[@class='attribute-table' and 0 < count(.//td[${tdPredicate}])]`);
}

async function ExpectAllResultsBatchAttributeValue(page: Page, xpath: string): Promise<number> {
  //  count the result rows
  const resultCount = await page.$$eval(`//table[@class='attribute-table']`,
    matches => matches.length);

  // fail there are no results
  expect(resultCount).toBeTruthy();

  // count the result rows with the attribute value
  const withValueCount = await page.$$eval(xpath, matches => matches.length);

  // assert all the resulting batches have the attribute value
  expect(withValueCount).toEqual(resultCount);

  return resultCount;
}
