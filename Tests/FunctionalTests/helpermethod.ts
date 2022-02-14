import { Page } from 'playwright'
const { pageObjectsConfig } = require('./pageObjects'); 
let fileSizeInBytes:any;
//<summary>
// Sign In to FSS UI using valid credentials
//</summary>
//<param> page Object </param>
//<param> userName </param>
//<param> password </param>
 export async function LoginPortal(page:Page, userName: string, password: string) {
    
    const [popup] = await Promise.all([
      page.waitForEvent('popup')
    ]);
    
      popup.setDefaultTimeout(60000);
      popup.setViewportSize({ 'width': 800, 'height': 1024 })
      await popup.waitForSelector(pageObjectsConfig.loginPopupSignInEmailSelector)
      popup.fill(pageObjectsConfig.loginPopupSignInEmailSelector, userName)
      await popup.waitForSelector(pageObjectsConfig.loginPopupNextButtonSelector)
      popup.click(pageObjectsConfig.loginPopupNextButtonSelector)
      await popup.waitForSelector(pageObjectsConfig.loginPopupSignInPasswordSelector)
      popup.fill(pageObjectsConfig.loginPopupSignInPasswordSelector, password)
      await popup.waitForTimeout(2000);
      popup.keyboard.press('Enter');  
      await popup.waitForTimeout(2000);
  }  

//<summary>
// Search attribute on FSS UI
//</summary>
//<param> page Object </param>
//<param> attributeName </param>

export async function SearchAttribute(page:Page, attributeName: string)
  {
    await page.fill(pageObjectsConfig.inputSearchFieldSelector,"");   
    await page.fill(pageObjectsConfig.inputSearchFieldSelector,attributeName);
    await page.keyboard.press('Backspace');    
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter'); 
    page.waitForLoadState('domcontentloaded');
  }

  export async function SearchAttributeSecondRow(page:Page, attributeName: string)
  {
    await page.fill(pageObjectsConfig.inputSearchFieldSelectorSecondRow,"");   
    await page.fill(pageObjectsConfig.inputSearchFieldSelectorSecondRow,attributeName);
    await page.keyboard.press('Backspace');    
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter'); 
    page.waitForLoadState('domcontentloaded');
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