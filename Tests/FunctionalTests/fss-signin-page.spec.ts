import { chromium, Browser, BrowserContext, Page } from 'playwright'
const { autoTestConfig } = require('./appSetting');
const { pageObjectsConfig } = require('./pageObjects');
import { join } from 'path'
let name: string;

describe('Test Sign In Page Scenario', () => {
  jest.setTimeout(30000);
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  beforeEach(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(autoTestConfig.url)
  })

  afterEach(async () => {
    await page.close()
    await context.close()
    await browser.close()
  })

  //Function to sign in portal
  //==================START==============================
  async function LoginPortal(username: string, password: string) {

    const [popup] = await Promise.all([
      page.waitForEvent('popup')
    ]);
    try {
      popup.setDefaultTimeout(30000);
      popup.setViewportSize({ 'width': 800, 'height': 1024 })
      await popup.waitForSelector(pageObjectsConfig.loginPopupSignInEmailSelector)
      popup.fill(pageObjectsConfig.loginPopupSignInEmailSelector, username)
      await popup.waitForSelector(pageObjectsConfig.loginPopupNextButtonSelector)
      popup.click(pageObjectsConfig.loginPopupNextButtonSelector)
      await popup.waitForSelector(pageObjectsConfig.loginPopupSignInPasswordSelector)
      popup.fill(pageObjectsConfig.loginPopupSignInPasswordSelector, password)
      await popup.waitForSelector(pageObjectsConfig.loginPopupSignInButtonSelector)
      popup.click(pageObjectsConfig.loginPopupSignInButtonSelector)
    }
    catch (e) {
      const errorPath = name.replace(" ", "") + "failedtest.jpeg"
      await popup.screenshot({
        path: join("screenshot",errorPath)
      });
      console.log(join(errorPath))
    }


  }
  //===============END===================================
  name = 'User clicks Sign in link with valid credentials should display FullName after login successfully'
  it(name, async () => {

    page.click(pageObjectsConfig.loginSignInLinkSelector);
    await LoginPortal(autoTestConfig.user, autoTestConfig.password);

    await page.waitForSelector(pageObjectsConfig.loginAccountSelector);
    expect(await page.innerHTML(pageObjectsConfig.loginAccountLinkSelector)).toEqual(autoTestConfig.userFullName);

  })

  name = 'User clicks Sign in link with valid credentials should navigate to search page after login successfully'
  it(name, async () => {

    page.click(pageObjectsConfig.loginSignInLinkSelector);
    await LoginPortal(autoTestConfig.user, autoTestConfig.password);

    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);
    expect(await page.innerHTML(pageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(pageObjectsConfig.searchPageContainerHeaderText);

  })

  name = 'User clicks Search link with valid credentials should navigate to search page after login successfully';
  it(name, async () => {

    page.click(pageObjectsConfig.searchButtonSelector);
    await LoginPortal(autoTestConfig.user, autoTestConfig.password);

    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);
    expect(await page.innerHTML(pageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(pageObjectsConfig.searchPageContainerHeaderText);

  })

  it('When user navigate to search url without Sign in it should navigate to fss home page', async () => {

    page.goto(autoTestConfig.url + "#/search/");

    await page.waitForSelector(pageObjectsConfig.homePageSignInHeaderInfoSelector);
    expect(await page.innerHTML(pageObjectsConfig.homePageSignInHeaderInfoSelector)).toEqual(pageObjectsConfig.homePageSignInHeaderInfoText);

  })

  it('User clicks on Search link and close the popup window user navigate to fss home page', async () => {

    page.click(pageObjectsConfig.searchButtonSelector);

    const [popup] = await Promise.all([
      page.waitForEvent('popup')
    ]);

    popup.close();

    await page.waitForSelector(pageObjectsConfig.homePageSignInHeaderInfoSelector);
    expect(await page.innerHTML(pageObjectsConfig.homePageSignInHeaderInfoSelector)).toEqual(pageObjectsConfig.homePageSignInHeaderInfoText);

  })

  it('User clicks on Sign in link and close the popup window user navigate to fss home page', async () => {

    page.click(pageObjectsConfig.loginSignInLinkSelector);

    const [popup] = await Promise.all([
      page.waitForEvent('popup')
    ]);

    popup.close();

    await page.waitForSelector(pageObjectsConfig.homePageSignInHeaderInfoSelector);
    expect(await page.innerHTML(pageObjectsConfig.homePageSignInHeaderInfoSelector)).toEqual(pageObjectsConfig.homePageSignInHeaderInfoText);

  })

})