import { Page, expect } from '@playwright/test';
import { commonObjectsConfig } from '../PageObjects/commonObjects.json';

//<summary>
// Clickng on Sign In link
//</summary>
//<param> page object </param>
//<param> username  </param>
//<param> password </param>

export async function AcceptCookies(page: Page) {
    const maxtime = Date.now() + 5000;
    const step = 500;
    let cookiesAccepted = false;
  
    // Some environments (but not all) need cookies to be accepted
    while (Date.now() < maxtime && !cookiesAccepted) {
      if (await page.locator(commonObjectsConfig.acceptCookieSelector).isVisible()) {
        await page.click(commonObjectsConfig.acceptCookieSelector);
        cookiesAccepted = true;
      }
      else {
        await page.waitForTimeout(step);
      }
    }
  }

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
  await page.waitForSelector("#signInEmail");
 // await popup.waitForLoadState();

  await popup.fill(commonObjectsConfig.loginPopupSignInEmailSelector, userName);
  await popup.click(commonObjectsConfig.loginPopupNextButtonSelector);
  await popup.fill(commonObjectsConfig.loginPopupSignInPasswordSelector, password);
  await popup.click(commonObjectsConfig.loginPopupSignInButtonSelector);

  await page.waitForNavigation();
}


