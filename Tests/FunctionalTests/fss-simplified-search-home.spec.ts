import { chromium, Browser, BrowserContext, Page } from 'playwright'
const { autoTestConfig } = require('./appSetting');
const { pageObjectsConfig,pageTimeOut } = require('./pageObjects');
import {LoginPortal,SearchAttribute} from './helpermethod'


describe('Test Search Attribute Scenario On Simplified Search Page', () => {
  jest.setTimeout(pageTimeOut.timeOutInMilliSeconds);
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;  

  beforeAll(async () => {
    browser = await chromium.launch({slowMo:100});
    context = await browser.newContext();
    page = await context.newPage();    
    await page.goto(autoTestConfig.url)
    await page.waitForTimeout(pageTimeOut.delay)
    if((await page.$$(pageObjectsConfig.acceptCookieSelector)).length > 0){
      await page.click(pageObjectsConfig.acceptCookieSelector);
    }
    page.click(pageObjectsConfig.searchButtonSelector);
    await LoginPortal(page,autoTestConfig.user, autoTestConfig.password);    
    
    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);
    expect(await page.innerHTML(pageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(pageObjectsConfig.searchPageContainerHeaderText);
  })

  afterAll(async () => {
     await page.close()
     await context.close()
     await browser.close()
  })

  it('Does it display "Simplified Search" link on advanced Search page', async () => {
    await page.waitForSelector(pageObjectsConfig.simplifiedSeatchLinkSelector);

    var simplifiedSearchLink = await page.innerText(pageObjectsConfig.simplifiedSeatchLinkSelector);
    expect(simplifiedSearchLink).toEqual(pageObjectsConfig.simplifiedSeatchLinkText);
  })

  it('Verify user clicks on "Simplified Search" link navigates to Simplified Search page', async () => {
    await page.click(pageObjectsConfig.simplifiedSeatchLinkSelector);
    //Verify element in advance search page count should be zero after navigating to simplified search page
    
    var simplifiedSearchBox= (await page.$$(pageObjectsConfig.inputSimplifiedSerachBoxSelector)).length
    expect(simplifiedSearchBox).toEqual(1);

    var advanceSearchElements =(await page.$$("#ukho-form-field-2,#ukho-form-field-3,#ukho-form-field-4")).length
    expect(advanceSearchElements).toEqual(0);
  })

  it('Does it display "Advanced Search" link on Simplified Search page', async () => {
       
    var advancedSearchLink = await page.innerText(pageObjectsConfig.advancedSeatchLinkSelector);
    expect(advancedSearchLink).toEqual(pageObjectsConfig.advancedSeatchLink);

  })

  it('Does it display "Error message" if user clicks on serach button and simplified search box is empty', async () => {
    await page.waitForSelector(pageObjectsConfig.inputSimplifiedSerachBoxSelector);
    await page.click(pageObjectsConfig.simplifiedSearchButtonSelector);
    var errorMessage = await page.innerText(pageObjectsConfig.dialogWarningSelector);
    expect(errorMessage).toContain(pageObjectsConfig.warningMessageValue);
  }) 

  it('Veify user clicks on "Advanced Search" link navigates to Advanced Search page', async () => {
    await page.click(pageObjectsConfig.advancedSeatchLinkSelector);

    await page.waitForSelector(pageObjectsConfig.advancedSearchTableSelector);

    //Verify element in simplified search page count should be zero after navigating to advanced search page
    
    var advanceSearchElements =(await page.$$(pageObjectsConfig.advancedSearchTableSelector)).length
    expect(advanceSearchElements).toEqual(3);
    
    //search box for simplified search is not present on advanced search page.
    var simplifiedSearchBox= (await page.$$(pageObjectsConfig.inputSimplifiedSerachBoxSelector)).length
    expect(simplifiedSearchBox).toEqual(0);
    
  })

})