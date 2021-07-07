import { chromium, Browser,BrowserContext, Page } from 'playwright'
const { autoTestConfig } = require('./appSetting');
const {pageObjectsConfig} = require('./pageObjects');

describe('Test Home Page Scenario', () => {
    jest.setTimeout(120000);
    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    beforeEach(async () => {
        browser = await chromium.launch({ 
          headless: true,
          channel:"chrome"});
          context = await browser.newContext();
          page = await context.newPage();
          await page.goto(autoTestConfig.url)
      })

      afterEach(async () => {
        await page.close()
        await context.close()
        await browser.close()
    })

    //Function to sign in portal
    //==================START==============================
    async function LoginPortal(username: string, password: string)
    {
      const [popup] = await Promise.all([
        page.waitForEvent('popup')
        ]);
      
      await popup.waitForSelector(pageObjectsConfig.loginPopupSignInEmailSelector)        
      popup.fill(pageObjectsConfig.loginPopupSignInEmailSelector, username)
      await popup.waitForSelector(pageObjectsConfig.loginPopupNextButtonSelector)
      popup.click(pageObjectsConfig.loginPopupNextButtonSelector)
      await popup.waitForSelector(pageObjectsConfig.loginPopupSignInPasswordSelector)
      popup.fill(pageObjectsConfig.loginPopupSignInPasswordSelector, password)
      await popup.waitForSelector(pageObjectsConfig.loginPopupSignInButtonSelector)
      popup.click(pageObjectsConfig.loginPopupSignInButtonSelector)   
      
    }  
    //===============END===================================

    it('User clicks Sign in link with valid credentails should display FirstName after login successfully', async () => {
    
        page.click(pageObjectsConfig.loginSignInLinkSelector);
        await LoginPortal(autoTestConfig.user,autoTestConfig.password); 

        await page.waitForSelector(pageObjectsConfig.loginAccountSelector);     
        expect(await page.innerHTML(pageObjectsConfig.loginAccountLinkSelector)).toEqual(autoTestConfig.userFullName);    
        
      })

      it('User clicks Sign in link with valid credentails should naviagte to search page after login successfully', async () => {
    
        page.click(pageObjectsConfig.loginSignInLinkSelector);
        await LoginPortal(autoTestConfig.user,autoTestConfig.password);  
        
        await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);    
        expect(await page.innerHTML(pageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(pageObjectsConfig.searchPageContainerHeaderText);    
        
      })

      it('User clicks Search link with valid credentails should naviagte to search page after login successfully', async () => {
    
        page.click(pageObjectsConfig.searchButtonSelector);
        await LoginPortal(autoTestConfig.user,autoTestConfig.password);  
        
        await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);    
        expect(await page.innerHTML(pageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(pageObjectsConfig.searchPageContainerHeaderText);       
        
      })

      it('When user navigate to search url without Sign in it should naviagte to fss home page', async () => {
        
        page.goto(autoTestConfig.url + "#/search/");
                
        await page.waitForSelector(pageObjectsConfig.homePageSignInHeaderInfoSelector);    
        expect(await page.innerHTML(pageObjectsConfig.homePageSignInHeaderInfoSelector)).toEqual(pageObjectsConfig.homePageSignInHeaderInfoText);       
        
      })

      it('User clicks on Search link and close the popup window user navigate to fss home page', async () => {
    
        page.click(pageObjectsConfig.searchButtonSelector);
    
        const [popup] = await Promise.all([
          page.waitForEvent('popup')
          ]);

        popup.close();       
        
        await page.waitForSelector(pageObjectsConfig.homePageSignInHeaderInfoSelector);    
        expect(await page.innerHTML(pageObjectsConfig.homePageSignInHeaderInfoSelector)).toEqual(pageObjectsConfig.homePageSignInHeaderInfoText);       
        
      })

      it('User clicks on Sign in link and close the popup window user navigate to fss home page', async () => {
    
        page.click(pageObjectsConfig.loginSignInLinkSelector);
    
        const [popup] = await Promise.all([
          page.waitForEvent('popup')
          ]);

        popup.close();       
        
        await page.waitForSelector(pageObjectsConfig.homePageSignInHeaderInfoSelector);    
        expect(await page.innerHTML(pageObjectsConfig.homePageSignInHeaderInfoSelector)).toEqual(pageObjectsConfig.homePageSignInHeaderInfoText);       
        
      })    

})