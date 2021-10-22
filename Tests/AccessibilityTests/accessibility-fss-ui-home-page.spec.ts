import { chromium, Browser, Page } from 'playwright'
import { injectAxe, getViolations} from 'axe-playwright'
const { autoTestConfig } = require('../FunctionalTests/appSetting.json');
const{pageTimeOut, pageObjectsConfig} =require('../FunctionalTests/pageObjects.json');

let browser: Browser
let page: Page

describe('FSS UI Home Page Accessibility Test Scenarios', () => {
  jest.setTimeout(pageTimeOut.timeOutInMilliSeconds);
  beforeAll(async () => {
    browser = await chromium.launch({slowMo:100})
    page = await browser.newPage()
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds)
    await page.goto(autoTestConfig.url)
    await page.waitForTimeout(pageTimeOut.delay)
        if ((await page.$$(pageObjectsConfig.acceptCookieSelector)).length > 0) {
            await page.click(pageObjectsConfig.acceptCookieSelector);            
        }
    await injectAxe(page)
  })

  test('should return no violation for "Skip to content" anchor tag', async() =>{
    const violations  =await getViolations(page, 'a.skip-to-content-link', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2aa'],
          },
        },
      })
      if (violations.length>0)
      {
        console.log(violations);
      }
      expect(violations.length).toBe(0);
  })

   test('should return no violation for image logo under ukho-header component ', async() =>{
    const violations  =await getViolations(page, '#main-menu > div > a > img', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2aa'],
          },
        },
      })
      expect(violations.length).toBe(0);
  })

  test('should return no violation for search link under ukho-header component ', async() =>{
    const violations  =await getViolations(page, '#Search >a', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2aa'],
          },
        },
      })
      if (violations.length>0)
      {
        console.log(violations);
      }
      expect(violations.length).toBe(0);

  })

  test('should return no violation for "sign in" link under ukho-header component ', async() =>{
    const violations  =await getViolations(page, '#signInButton > a', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2aa'],
          },
        },
      })
      if (violations.length>0)
      {
        console.log(violations);
      }
      expect(violations.length).toBe(0);
  })

  test('should return no violations for "Privacy policy" link in ukho-footer', async() =>{
    const violations  =await getViolations(page, '.footer-links >a:nth-of-type(1)', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2aa'],
          },
        },
      })
      if (violations.length>0)
        {
        console.log(violations);
        }
      expect(violations.length).toBe(0);
  })

  test('should return no violations for "Accessibility" link in ukho-footer', async() =>{
    const violations  =await getViolations(page, '.footer-links >a:nth-of-type(2)', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2aa'],
          },
        },
      })
      if (violations.length>0)
      {
        console.log(violations);
      }
      expect(violations.length).toBe(0);
  })

  test('should return no violations for "UK Hydrographic Office" image in ukho-footer', async() =>{
    const violations  =await getViolations(page, '.footer-img >a>img', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2aa'],
          },
        },
      })
      if (violations.length>0)
      {
        console.log(violations);
      }
      expect(violations.length).toBe(0);
  })

  test('should return no violations for "UK Hydrographic Office" link in ukho-footer', async() =>{
    const violations  =await getViolations(page, '.footer-img >a', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2aa'],
          },
        },
      })
      if (violations.length>0)
      {
        console.log(violations);
      }
      expect(violations.length).toBe(0);
  })

  test('should return no violations for "Create a new account" link', async() =>{
    const violations  =await getViolations(page, '#fss-createaccount', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2aa'],
          },
        },
      })
      if (violations.length>0)
      {
        console.log(violations);
      }
      expect(violations.length).toBe(0);
  })

  test('should return no violations for main logo', async() =>{
    const violations  =await getViolations(page, '#mainContainer > .header-image', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2aa'],
          },
        },
      })
      if (violations.length>0)
      {
        console.log(violations);
      }
      expect(violations.length).toBe(0);
  })

  test('should return no violations for feedback link', async() =>{
    const violations  =await getViolations(page, '.phasebanner a', {
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2aa'],
          },
        },
      })
      if (violations.length>0)
       {
         console.log(violations);
       }
      expect(violations.length).toBe(0);
  })

  afterAll(async () => {
    await page.close();
    await browser.close();
  })

})
