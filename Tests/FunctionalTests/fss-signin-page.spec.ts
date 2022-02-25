import { BrowserContext, Page } from 'playwright'
const { autoTestConfig } = require('./appSetting');
const { pageObjectsConfig, pageTimeOut } = require('./pageObjects');
import {LoginPortal} from './helpermethod'

describe('Test Sign In Page Scenario', () => {
  let context: BrowserContext;
  let page: Page;

  beforeEach(async () => {    
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(autoTestConfig.url)
    await page.waitForTimeout(pageTimeOut.delay)
    if((await page.$$(pageObjectsConfig.acceptCookieSelector)).length > 0){
      await page.click(pageObjectsConfig.acceptCookieSelector);
    }
  })

  afterEach(async () => {
    await page.close()
    await context.close()   
  }) 
 
  it('User clicks Sign in link with valid credentials should display FullName after login successfully', async () => {

    page.click(pageObjectsConfig.loginSignInLinkSelector);
    await LoginPortal(page,autoTestConfig.user, autoTestConfig.password);

    await page.waitForSelector(pageObjectsConfig.loginAccountSelector);
    expect(await page.innerHTML(pageObjectsConfig.loginAccountLinkSelector)).toEqual(autoTestConfig.userFullName);

  })

  
  it('User clicks Sign in link with valid credentials should navigate to search page after login successfully', async () => {

    page.click(pageObjectsConfig.loginSignInLinkSelector);
    await LoginPortal(page,autoTestConfig.user, autoTestConfig.password);

    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);
    expect(await page.innerHTML(pageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(pageObjectsConfig.searchPageContainerHeaderText);

  })
  
  it('User clicks Search link with valid credentials should navigate to search page after login successfully', async () => {

    page.click(pageObjectsConfig.searchButtonSelector);
    await LoginPortal(page,autoTestConfig.user, autoTestConfig.password);

    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);
    expect(await page.innerHTML(pageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(pageObjectsConfig.searchPageContainerHeaderText);

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
