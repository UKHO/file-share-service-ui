import { BrowserContext, Page } from 'playwright'
const { autoTestConfig } = require('./appSetting');
const { pageObjectsConfig, pageTimeOut } = require('./pageObjects');
import {AcceptCookies, LoginPortal} from './helpermethod'

describe('Test Sign In Page Scenario', () => {
  jest.setTimeout(pageTimeOut.timeOutInMilliSeconds);
  let context: BrowserContext;
  let page: Page;

  beforeEach(async () => {    
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(autoTestConfig.url)
    await AcceptCookies(page);
  })

  afterEach(async () => {
    await page.close()
    await context.close()   
  }) 
 
  it('User clicks Sign in link with valid credentials should display FullName after login successfully', async () => {

    await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, pageObjectsConfig.loginSignInLinkSelector);

    await page.waitForSelector(pageObjectsConfig.loginAccountSelector);
    expect(await page.innerHTML(pageObjectsConfig.loginAccountLinkSelector)).toContain(autoTestConfig.userFullName);

  })

  
  it('User clicks Sign in link with valid credentials should navigate to search page after login successfully', async () => {

    await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, pageObjectsConfig.loginSignInLinkSelector);

    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);
    expect(await page.innerHTML(pageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(pageObjectsConfig.searchPageContainerHeaderText);

  })

  it('User clicks on Sign in link and close the popup window user navigate to fss home page', async () => {


    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.click(pageObjectsConfig.loginSignInLinkSelector)
    ]);

    popup.close();

    await page.waitForSelector(pageObjectsConfig.homePageSignInHeaderInfoSelector);
    expect(await page.innerHTML(pageObjectsConfig.homePageSignInHeaderInfoSelector)).toEqual(pageObjectsConfig.homePageSignInHeaderInfoText);

  })

}) 
