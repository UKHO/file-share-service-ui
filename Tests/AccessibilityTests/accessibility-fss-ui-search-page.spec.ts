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
    context = await browser.newContext();
    page = await context.newPage();
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds)
    await page.goto(autoTestConfig.url)
    page.click(pageObjectsConfig.loginSignInLinkSelector);
    await LoginPortal(page,autoTestConfig.user, autoTestConfig.password);
  })  

  test('should return no violation for add rows element', async () => {
    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);
    await injectAxe(page);
    const violations = await getViolations(page, '.addNewLine', {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2aa'],
        },
      },
    })
    if (violations.length > 0) {
      console.log(violations);
    }
    expect(violations.length).toBe(0);
  })

  test('should return no violation for search result table', async () => {
    page.waitForTimeout(pageTimeOut.delay);
    await page.waitForSelector("#ukho-form-field-3");
    await SearchAttribute(page, "BusinessUnit");
    await page.selectOption("#ukho-form-field-2", "eq");
    await page.fill("#ukho-form-field-4", "adds");
    await page.click("//button[text()='Search']");
    page.waitForTimeout(pageTimeOut.delay);
    await page.waitForSelector(".attribute-table");
    const violations = await getViolations(page, '.attribute-table', {
      axeOptions: {
        runOnly: {
          type: 'tag', values: ['wcag2aa'],
        },
      },
    })
    if (violations.length > 0) {
      console.log(violations);
    }
    expect(violations.length).toBe(0);
  })

  test('should return no violation for Attributes dropdown element', async () => {
    
    page.waitForSelector("#ukho-form-field-3")
    await injectAxe(page);
    const violations = await getViolations(page, '#ukho-form-field-3', {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2aa'],
        },
      },
    })
    if (violations.length > 0) {
      console.log(violations);
    }
    expect(violations.length).toBe(0);
  })

  test('should return no violation for Operator dropdown element', async () => {
    
    page.waitForSelector("#ukho-form-field-2")
    await injectAxe(page);
    const violations = await getViolations(page, '#ukho-form-field-2', {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2aa'],
        },
      },
    })
    if (violations.length > 0) {
      console.log(violations);
    }
    expect(violations.length).toBe(0);
  })

  test('should return no violation for value inputbox element', async () => {
    
    page.waitForSelector("#ukho-form-field-4")
    await injectAxe(page);
    const violations = await getViolations(page, '#ukho-form-field-4', {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2aa'],
        },
      },
    })
    if (violations.length > 0) {
      console.log(violations);
    }
    expect(violations.length).toBe(0);
  }) 

  afterAll(async () => {
    await page.close();
    await context.close();
    await browser.close();
  })

})