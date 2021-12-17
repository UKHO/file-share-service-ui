import { chromium, BrowserContext, Browser, Page } from 'playwright'
import { injectAxe, getViolations } from 'axe-playwright'
const { autoTestConfig } = require('../FunctionalTests/appSetting.json');
const { pageObjectsConfig, pageTimeOut } = require('../FunctionalTests/pageObjects.json');
import { SearchAttribute,LoginPortal } from '../FunctionalTests/helpermethod'

let browser: Browser
let context: BrowserContext;
let page: Page

describe('FSS UI Search Page Accessibility Test Scenarios', () => {
  jest.setTimeout(pageTimeOut.timeOutInMilliSeconds);
  beforeAll(async () => {
    browser = await chromium.launch({ slowMo: 100})    
    page = await browser.newPage();
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds)
    await page.goto(autoTestConfig.url)
    await page.waitForTimeout(pageTimeOut.delay)
    if((await page.$$(pageObjectsConfig.acceptCookieSelector)).length > 0){
      await page.click(pageObjectsConfig.acceptCookieSelector);
    }
    page.click(pageObjectsConfig.loginSignInLinkSelector);
    await LoginPortal(page,autoTestConfig.user, autoTestConfig.password);
  })  

  test('should return no violations for FSS search page accessibility check', async () => {
    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);
    await page.waitForSelector('.addNewLine');
    await injectAxe(page);
    const violations = await getViolations(page, '', {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a'],
        },
      },
      detailedReport: true,
      detailedReportOptions: { html: true }      
      
    }) 
    expect(violations.length).toBe(0);
  })
 
  afterAll(async () => {
    await page.close();  
    await browser.close();
  })

}) 