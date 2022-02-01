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
 
  it('Verify user clicks on "Simplified Search" link navigates to Simplified Search page', async () => {
    await page.click(pageObjectsConfig.simplifiedSearchLinkSelector);
    //Verify element in advance search page count should be zero after navigating to simplified search page
    
    var simplifiedSearchBox= (await page.$$(pageObjectsConfig.inputSimplifiedSearchBoxSelector)).length
    expect(simplifiedSearchBox).toEqual(1);

    var advanceSearchElements =(await page.$$("#ukho-form-field-2,#ukho-form-field-3,#ukho-form-field-4")).length
    expect(advanceSearchElements).toEqual(0);
  })

  it('Does it display "Advanced Search" link on Simplified Search page', async () => {
       
    var advancedSearchLink = await page.innerText(pageObjectsConfig.advancedSearchLinkSelector);
    expect(advancedSearchLink).toEqual(pageObjectsConfig.advancedSearchLink);

  })

  it('Does it display "Error message" if user clicks on search button and simplified search box is empty', async () => {
    await page.waitForSelector(pageObjectsConfig.inputSimplifiedSearchBoxSelector);
    await page.click(pageObjectsConfig.simplifiedSearchButtonSelector);
    var errorMessage = await page.innerText(pageObjectsConfig.dialogWarningSelector);
    expect(errorMessage).toContain(pageObjectsConfig.warningMessageValue);
  }) 

  it('Verify user clicks on "Advanced Search" link navigates to Advanced Search page', async () => {
    await page.click(pageObjectsConfig.advancedSearchLinkSelector);
    await page.waitForSelector(pageObjectsConfig.advancedSearchAddLineSelector);
    await page.click(pageObjectsConfig.advancedSearchAddLineSelector);
    await page.waitForSelector(pageObjectsConfig.advancedSearchTableSelector);

    //Verify element in simplified search page count should be zero after navigating to advanced search page
    
    var advanceSearchElements =(await page.$$(pageObjectsConfig.advancedSearchTableSelector)).length
    expect(advanceSearchElements).toEqual(3);
    
    //search box for simplified search is not present on advanced search page.
    var simplifiedSearchBox= (await page.$$(pageObjectsConfig.inputSimplifiedSearchBoxSelector)).length
    expect(simplifiedSearchBox).toEqual(0);
    
  })

})