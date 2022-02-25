import { chromium, Browser, Page } from 'playwright'
import { injectAxe,checkA11y } from 'axe-playwright'
const { autoTestConfig } = require('../FunctionalTests/appSetting.json');
const { pageObjectsConfig, pageTimeOut } = require('../FunctionalTests/pageObjects.json');
import { LoginPortal} from '../FunctionalTests/helpermethod'

let browser: Browser
let page: Page

describe('FSS UI Simplified Search Page Accessibility Test Scenarios', () => {
  jest.setTimeout(pageTimeOut.timeOutInMilliSeconds);
  beforeAll(async () => {
    browser = await chromium.launch({ slowMo: 100})    
    page = await browser.newPage();
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds)
    await page.goto(autoTestConfig.url)

    await LoginPortal(page,autoTestConfig.user, autoTestConfig.password);
    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);   

    await page.click(pageObjectsConfig.simplifiedSearchLinkSelector);
        
    var simplifiedSearchBox= (await page.$$(pageObjectsConfig.inputSimplifiedSearchBoxSelector)).length
    expect(simplifiedSearchBox).toEqual(1);  
    
  })    

  test('check a11y for the initial page load and axe run options', async () => {
    await injectAxe(page);
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

  test('check a11y for no search result html and axe run options', async () => {
    await page.click(pageObjectsConfig.simplifiedSearchButtonSelector);
    await page.waitForSelector(pageObjectsConfig.dialogWarningSelector);
    await injectAxe(page);
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

  test('check a11y for simplified search result html and axe run options', async () => {
    await page.fill(pageObjectsConfig.inputSimplifiedSearchBoxSelector,"tes");
    await page.click(pageObjectsConfig.simplifiedSearchButtonSelector);
    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);
    await injectAxe(page);
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