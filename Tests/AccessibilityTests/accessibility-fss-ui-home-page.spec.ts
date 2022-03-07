import { chromium, Browser, Page } from 'playwright'
import { injectAxe, checkA11y} from 'axe-playwright'
import { AcceptCookies } from '../FunctionalTests/helpermethod';
const { autoTestConfig } = require('../FunctionalTests/appSetting.json');
const{ pageTimeOut } = require('../FunctionalTests/pageObjects.json');

let browser: Browser
let page: Page

describe('FSS UI Home Page Accessibility Test Scenarios', () => {
  jest.setTimeout(pageTimeOut.timeOutInMilliSeconds);
  beforeAll(async () => {
    browser = await chromium.launch({slowMo:100})
    page = await browser.newPage()
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds)
    await page.goto(autoTestConfig.url)
    await AcceptCookies(page);
    await injectAxe(page)
  })

  test('check a11y for the whole page and axe run options', async () => {
    await checkA11y(page, undefined, {
      axeOptions: {
        rules: {
          'color-contrast': { enabled: false }    
        },
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
