import { Page } from 'playwright'
const { pageObjectsConfig } = require('./pageObjects'); 

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
      await popup.waitForSelector(pageObjectsConfig.loginPopupSignInButtonSelector)
      popup.click(pageObjectsConfig.loginPopupSignInButtonSelector) 
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