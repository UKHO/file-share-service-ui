import { chromium, BrowserContext, Browser, Page } from 'playwright'
import { injectAxe,checkA11y } from 'axe-playwright'
const { autoTestConfig } = require('../FunctionalTests/appSetting.json');
const { pageObjectsConfig, pageTimeOut } = require('../FunctionalTests/pageObjects.json');
import { LoginPortal,SearchAttribute } from '../FunctionalTests/helpermethod'
import {batchAttributeProductContains} from '../FunctionalTests/helperconstant'

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
    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);   
    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page,"productid");
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"contains");     
    await page.fill(pageObjectsConfig.inputSearchValueSelector,batchAttributeProductContains);
    await page.click(pageObjectsConfig.searchAttributeButton);
    
    // Verification of attribute table records
    await page.waitForSelector(pageObjectsConfig.searchAttributeTable);
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await injectAxe(page);
  })  

  test('check a11y for the whole page and axe run options', async () => {
    await checkA11y(page, undefined, {
      axeOptions: {
         rules :{'duplicate-id': { enabled: false },
                 'label': { enabled: false },
                 'select-name': { enabled: false }},       
        runOnly: {         
          type: 'tag',
          values: ['wcag2a'],
        },
      },
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  })
 
  afterAll(async () => {
    await page.close();  
    await browser.close();
  })

}) 