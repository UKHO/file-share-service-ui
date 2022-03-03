import { chromium,Browser, Page } from 'playwright'
import { injectAxe,checkA11y } from 'axe-playwright'
const { autoTestConfig } = require('../FunctionalTests/appSetting.json');
const { pageObjectsConfig, pageTimeOut } = require('../FunctionalTests/pageObjects.json');
import { LoginPortal, SearchAttribute, ClickWaitRetry, AcceptCookies } from '../FunctionalTests/helpermethod'
import {batchAttributeProductContains} from '../FunctionalTests/helperconstant'

let browser: Browser
let page: Page

describe('FSS UI Search Page Accessibility Test Scenarios', () => {
  jest.setTimeout(pageTimeOut.timeOutInMilliSeconds);
  beforeAll(async () => {
    browser = await chromium.launch({ slowMo: 100})    
    page = await browser.newPage();
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds)
    await page.goto(autoTestConfig.url)
    await AcceptCookies(page);
    await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, pageObjectsConfig.loginSignInLinkSelector);
    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);   
    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page,"productid");
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"contains");     
    await page.fill(pageObjectsConfig.inputSearchValueSelector,batchAttributeProductContains);

    await ClickWaitRetry(page, pageObjectsConfig.searchAttributeButton, pageObjectsConfig.searchAttributeTable);

    // Verification of attribute table records
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await injectAxe(page);
  })  

  test('check a11y for the whole page and axe run options', async () => {
    await checkA11y(page, undefined, {
      axeOptions: {               
        runOnly: {         
          type: 'tag',
          values: ['wcag2aa'],
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