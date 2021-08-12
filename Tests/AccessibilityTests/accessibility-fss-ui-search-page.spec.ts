import { chromium, BrowserContext, Browser, Page } from 'playwright'
import { injectAxe, getViolations } from 'axe-playwright'
const { autoTestConfig } = require('../FunctionalTests/appSetting.json');
const { pageObjectsConfig, pageTimeOut } = require('../FunctionalTests/pageObjects.json');
import { join } from 'path'
import { SearchAttribute } from '../FunctionalTests/helpermethod'
let name: string;

let browser: Browser
let context: BrowserContext;
let page: Page

describe('FSS UI Search Page Accessibility Test Scenarios', () => {
  jest.setTimeout(pageTimeOut.timeOutInMilliSeconds);
  beforeEach(async () => {
    browser = await chromium.launch({ slowMo: 100, headless: false })
    context = await browser.newContext();
    page = await context.newPage();
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds)
    await page.goto(autoTestConfig.url)
    page.click(pageObjectsConfig.loginSignInLinkSelector);
    await LoginPortal(autoTestConfig.user, autoTestConfig.password);
  })

  //Function to sign in portal
  //==================START==============================
  async function LoginPortal(username: string, password: string) {

    const [popup] = await Promise.all([
      page.waitForEvent('popup')
    ]);
    try {
      popup.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
      popup.setViewportSize({ 'width': 800, 'height': 1024 })
      await popup.waitForSelector(pageObjectsConfig.loginPopupSignInEmailSelector)
      popup.fill(pageObjectsConfig.loginPopupSignInEmailSelector, username)
      await popup.waitForSelector(pageObjectsConfig.loginPopupNextButtonSelector)
      popup.click(pageObjectsConfig.loginPopupNextButtonSelector)
      await popup.waitForSelector(pageObjectsConfig.loginPopupSignInPasswordSelector)
      popup.fill(pageObjectsConfig.loginPopupSignInPasswordSelector, password)
      await popup.waitForTimeout(2000);
      popup.keyboard.press('Enter');  
      await popup.waitForTimeout(2000);
    }
    catch (e) {
      const errorPath = name.replace(" ", "") + "failedtest.jpeg"
      await popup.screenshot({
        path: join("screenshot", errorPath)
      });
      console.log(join(errorPath))
    }


  }
  name = 'should return no violation for add rows  element'
  test(name, async () => {
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

  test('should return no violation for Attributes dropdown element', async () => {
    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);
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

  test('should return no violation for Operator dropdown element', async () => {
    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);
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

  test('should return no violation for value inputbox element', async () => {
    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);
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

  test('should return no violation for search result table', async () => {
    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);
    await page.waitForSelector("#ukho-form-field-3");
    await SearchAttribute(page, "BusinessUnit");
    await page.selectOption("#ukho-form-field-2", "eq");
    await page.fill("#ukho-form-field-4", "adds");
    await page.click("//button[text()='Search']");
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

  afterEach(async () => {
    await page.close();
    await context.close();
    await browser.close();
  })

})