import { chromium, Browser, BrowserContext, Page } from 'playwright'
const { autoTestConfig } = require('../FunctionalTests/appSetting.json');
const { pageObjectsConfig, pageTimeOut } = require('../FunctionalTests/pageObjects.json');
import { LoginPortal, SearchAttribute, ClickWaitRetry, AcceptCookies } from '../FunctionalTests/helpermethod'
import { businessUnitValue, fileSizeValue, batchAttributeProduct } from './helperattributevalues'
import { GetApiDetails } from './apiRequest'

describe('FSS UI E2E Scenarios', () => {
  jest.setTimeout(pageTimeOut.timeOutInMilliSeconds);
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch({slowMo: 100, headless: false});   
  })

  beforeEach(async () => {    
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(autoTestConfig.url);
    await AcceptCookies(page);
    await LoginPortal(page, autoTestConfig.user, autoTestConfig.password, pageObjectsConfig.loginSignInLinkSelector);

    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);
    expect(await page.innerHTML(pageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(pageObjectsConfig.searchPageContainerHeaderText);
  })

  afterEach(async () => {
    await page.close();
    await context.close(); 
  })
  afterAll(async () => {    
    await browser.close();
  })

  it('Valid search system attributes query to verify data returns on UI and API response status 200', async () => {
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, "BusinessUnit");
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector, "eq");
    await page.fill(pageObjectsConfig.inputSearchValueSelector, businessUnitValue);    

    await ClickWaitRetry(page, pageObjectsConfig.searchAttributeButton, pageObjectsConfig.searchAttributeTable);

    // Verification of attribute table records
    const noOfRecods = (await page.$$(pageObjectsConfig.searchAttributeTableRows)).length;
    expect(noOfRecods).toBeGreaterThanOrEqual(2);

    //Get the token from local storage once user logged in
    const idToken = await page.evaluate(() => { return localStorage.getItem('idToken') });

    //Search Query String
    const queryString = `BusinessUnit eq '${businessUnitValue}'`;

    //Validate api response status code matches 200 
    var statusCode = await GetApiDetails(autoTestConfig.apiurl, queryString, idToken!);

    expect(statusCode).toEqual(200);

  })

  it('Valid search user attributes query to verify data returns on UI and API response status 200', async () => {
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, "Product Type");
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector, "eq");
    await page.fill(pageObjectsConfig.inputSearchValueSelector, batchAttributeProduct);

    await ClickWaitRetry(page, pageObjectsConfig.searchAttributeButton, pageObjectsConfig.searchAttributeTable);

    //  count the resulting batches
    const batchCount = await page.$$eval(`//table[@class='attribute-table']`, matches => matches.length);
    
    // must be at least one search result for this test to be useful
    expect(batchCount).toBeGreaterThan(0);

    // count the resulting batches with the searched-for attribute value
    const batchesWithAttributeCount = await page.$$eval(`//td[text()="${batchAttributeProduct}"]/ancestor::table[@class='attribute-table']`, 
      matches => matches.length);

    // assert all the resulting batches have the attribute value
    expect(batchesWithAttributeCount).toEqual(batchCount);

    // Get the token from local storage once user logged in
    const idToken = await page.evaluate(() => { return localStorage.getItem('idToken') });

    //Search Query String
    const queryString = `$batch("Product Type") eq '${batchAttributeProduct}'`;

    //Validate api response status code matches 200 
    var statusCode = await GetApiDetails(autoTestConfig.apiurl, queryString, idToken!);

    expect(statusCode).toEqual(200);

  })

  it('Invalid search query to verify data returns on UI and API response status 400', async () => {
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page, "FileSize");
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector, "eq");
    await page.fill(pageObjectsConfig.inputSearchValueSelector, `'${fileSizeValue}'`);
    await page.waitForTimeout(2000);

    await ClickWaitRetry(page, pageObjectsConfig.searchAttributeButton, pageObjectsConfig.warningMessageSelector);

    //Verification of warning message
    const warningMessage = await page.innerText(pageObjectsConfig.warningMessageSelector);

    expect(warningMessage).toContain(pageObjectsConfig.warningMessageText);

    //Get the token from local storage once user logged in
    const idToken = await page.evaluate(() => { return localStorage.getItem('idToken') })

    //Search Query String
    const queryString = `FileSize eq '${fileSizeValue}'`;

    //Validate api response status code matches 400 
    var statusCode = await GetApiDetails(autoTestConfig.apiurl, queryString, idToken!);

    expect(statusCode).toEqual(400);

  })
})