import { chromium,Browser, Page } from 'playwright'
import { injectAxe,checkA11y } from 'axe-playwright'
const { autoTestConfig } = require('../FunctionalTests/appSetting.json');
const { pageObjectsConfig, pageTimeOut } = require('../FunctionalTests/pageObjects.json');
import { LoginPortal, SearchAttribute, ClickWaitRetry, AcceptCookies } from '../FunctionalTests/helpermethod';
import {attributeProductType} from '../FunctionalTests/helperconstant';

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
    await page.click(pageObjectsConfig.advancedSearchLinkSelector, {force: true});

    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"contains");
    await page.fill(pageObjectsConfig.inputSearchValueSelector, attributeProductType.value);

    await ClickWaitRetry(page, pageObjectsConfig.searchAttributeButton, pageObjectsConfig.searchAttributeTable, undefined, 10000);

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