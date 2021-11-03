import { chromium, Browser, BrowserContext, Page } from 'playwright'
const { autoTestConfig } = require('./appSetting');
const { pageObjectsConfig,pageTimeOut } = require('./pageObjects');
import {LoginPortal,SearchAttribute} from './helpermethod'
import {stringOperatorList,symbolOperatorListForFileSize, symbolOperatorListForDate} from './helperconstant'


describe('Test Search Attribute Scenario On Search Page', () => {
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

  it('Verify if click search button without selecting a field value', async () => {
    await page.click(pageObjectsConfig.searchAttributeButton);

    var errorMessage = await page.innerText(pageObjectsConfig.dialogWarningSelector);
    expect(errorMessage).toContain(pageObjectsConfig.warningMessageValue);
  })
 
  it('Verify Operator dropdown contains correct values when "BusinessUnit" attribute field selected', async () => { 
    await SearchAttribute(page,"BusinessUnit"); 
     const operatorsOption = await page.$$eval(pageObjectsConfig.operatorDropDownItemsSelector ,options => { return options.map(option => option.textContent) });
    
    var match = (stringOperatorList.length == operatorsOption.length) && stringOperatorList.every(function(element, index) {
        return element === operatorsOption[index]; 
    });
    
    expect(match).toBeTruthy();    

  })

  it('Verify Operator dropdown contains correct values when "FileSize" attribute field selected', async () => {
    await SearchAttribute(page,"FileSize");  
    
    const operatorsOption = await page.$$eval(pageObjectsConfig.operatorDropDownItemsSelector ,options => { return options.map(option => option.textContent) });
    var match = (symbolOperatorListForFileSize.length == operatorsOption.length) && symbolOperatorListForFileSize.every(function(element, index) {
        return element === operatorsOption[index]; 
    });
    
    expect(match).toBeTruthy();   

  })

  it('Verify Operator dropdown contains correct values when "FileName" attribute field selected', async () => {
    await SearchAttribute(page,"FileName");    
    
    const operatorsOption = await page.$$eval(pageObjectsConfig.operatorDropDownItemsSelector ,options => { return options.map(option => option.textContent) });
    var match = (stringOperatorList.length == operatorsOption.length) && stringOperatorList.every(function(element, index) {
        return element === operatorsOption[index]; 
    });
    
    expect(match).toBeTruthy();   

  })

  it('Verify Operator dropdown contains correct values when "MimeType" attribute field selected', async () => {
    await SearchAttribute(page,"MimeType");     
    
    const operatorsOption = await page.$$eval(pageObjectsConfig.operatorDropDownItemsSelector ,options => { return options.map(option => option.textContent) });
    var match = (stringOperatorList.length == operatorsOption.length) && stringOperatorList.every(function(element, index) {
        return element === operatorsOption[index]; 
    });
    
    expect(match).toBeTruthy();   

  })

  it('Verify Operator dropdown contains correct values when "BatchExpiryDate" attribute field selected', async () => {
    await SearchAttribute(page,"BatchExpiryDate");  
    
    const operatorsOption = await page.$$eval(pageObjectsConfig.operatorDropDownItemsSelector ,options => { return options.map(option => option.textContent) });
    var match = (symbolOperatorListForDate.length == operatorsOption.length) && symbolOperatorListForDate.every(function(element, index) {
        return element === operatorsOption[index]; 
    });
    
    expect(match).toBeTruthy();   

  })

  it('Verify Operator dropdown contains correct values when "BatchPublishedDate" attribute field selected', async () => {
    await SearchAttribute(page,"BatchPublishedDate");    
    
    const operatorsOption = await page.$$eval(pageObjectsConfig.operatorDropDownItemsSelector ,options => { return options.map(option => option.textContent) });
    var match = (symbolOperatorListForDate.length == operatorsOption.length) && symbolOperatorListForDate.every(function(element, index) {
        return element === operatorsOption[index]; 
    });
    expect(match).toBeTruthy();   

  })

  it('Verify when "BusinessUnit" attribute field selected, input value field change to "text" type', async () => {
    await SearchAttribute(page,"BusinessUnit");  
   
    const inputValueFieldAttribute=await page.getAttribute(pageObjectsConfig.inputSearchValueSelector,"type");
    expect(inputValueFieldAttribute).toEqual("text");
  })

  it('Verify when "FileSize" attribute field selected, input value field change to "tel" type', async () => {
    await SearchAttribute(page,"FileSize");  

    const inputValueFieldAttribute=await page.getAttribute(pageObjectsConfig.inputSearchValueSelector,"type");
    expect(inputValueFieldAttribute).toEqual("tel");
  })

  it('Verify when "BatchPublishedDate" attribute field selected, input value field change to "date" type', async () => {
    await SearchAttribute(page,"BatchPublishedDate");  
    
    const inputValueFieldAttribute=await page.getAttribute(pageObjectsConfig.inputSearchValueSelector,"type");
    expect(inputValueFieldAttribute).toEqual("date");
  })

  it('When click on "Add new line" button a new row added to the query table', async () => {
    await page.waitForSelector(pageObjectsConfig.inputSearchFieldSelector); 
    let tableRows=(await page.$$(pageObjectsConfig.searchQueryTableRowSelector)).length;  
    expect(tableRows).toEqual(1); 

    //add new row
    await page.click(".addNewLine");
    tableRows=(await page.$$(pageObjectsConfig.searchQueryTableRowSelector)).length;    
    expect(tableRows).toEqual(2);
  })

  it('When click on "Delete" button a row deleted from the query table', async () => {
    await page.waitForSelector(pageObjectsConfig.inputSearchFieldSelector);  
    let tableRows=(await page.$$(pageObjectsConfig.searchQueryTableRowSelector)).length;    
    expect(tableRows).toEqual(2);

    //delete a row
    await page.click(".deleteRow");
    tableRows=(await page.$$(pageObjectsConfig.searchQueryTableRowSelector)).length;    
    expect(tableRows).toEqual(1);

  }) 

}) 
