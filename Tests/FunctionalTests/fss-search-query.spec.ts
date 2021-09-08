import { chromium, Browser, BrowserContext, Page } from 'playwright'
const { autoTestConfig } = require('./appSetting');
const { pageObjectsConfig,pageTimeOut } = require('./pageObjects');
import {LoginPortal,SearchAttribute,SearchAttributeSecondRow,GetFileSizeInBytes} from './helpermethod'
import {batchAttributeProductContains,batchAttributeSpecialChar,systemAttributeMimeType} from './helperconstant'
import {batchAttributeProduct,batchAttributeCellName,batchAttributeFileSize,searchQuerySqlInjection} from './helperconstant'

describe('Test Search Query Scenario On Search Page', () => {
  jest.setTimeout(pageTimeOut.timeOutInMilliSeconds);
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;  

  beforeEach(async () => {
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

  afterEach(async () => {
     await page.close()
     await context.close()
     await browser.close()
  })

  it('Batch Attribute table returns correct product on attribute search', async () => {    
    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page,"product");
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"contains");     
    await page.fill(pageObjectsConfig.inputSearchValueSelector,batchAttributeProductContains);
    await page.click(pageObjectsConfig.searchAttributeButton);
    
    // Verification of attribute table records
    await page.waitForSelector(pageObjectsConfig.searchAttributeTable);
    const productNames = await page.$$eval(pageObjectsConfig.attributeTableDataSelector ,options => { return options.map(option => option.textContent) });
    
    for (let index = 0; index < productNames.length; index++) {
        const productName = productNames[index];  
        
        expect(productName.toUpperCase()).toContain(batchAttributeProductContains.toUpperCase());            
    }    
    
  })

  it('Batch Attribute table returns correct product on special characters search', async () => {        
   
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page,"product");
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"contains");     
    await page.fill(pageObjectsConfig.inputSearchValueSelector,batchAttributeSpecialChar);
    await page.click(pageObjectsConfig.searchAttributeButton);
    
    // Verification of attribute table records
    await page.waitForSelector(pageObjectsConfig.searchAttributeTable);
    const productNames = await page.$$eval(pageObjectsConfig.attributeTableDataSelector ,options => { return options.map(option => option.textContent) });
    
    for (let index = 0; index < productNames.length; index++) {
        const productName = productNames[index];  
        
        expect(productName.toUpperCase()).toContain(batchAttributeSpecialChar.toUpperCase());            
    }
    
  })

  it('Batch Attribute table returns correct values on multiple attributes search', async () => {    
    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page,"product");
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"contains");     
    await page.fill(pageObjectsConfig.inputSearchValueSelector,batchAttributeProductContains);
    await page.click(pageObjectsConfig.buttonAddNewRow);

    await SearchAttributeSecondRow(page, "MimeType");
    await page.selectOption(pageObjectsConfig.operatorDropDownSelectorSecondRow,"eq");     
    await page.fill(pageObjectsConfig.inputSearchValueSelectorSecondRow,systemAttributeMimeType);

    await page.click(pageObjectsConfig.searchAttributeButton);
    
    // Verification of attribute table records
    await page.waitForSelector(pageObjectsConfig.searchAttributeTable);
    const productNames = await page.$$eval(pageObjectsConfig.attributeTableDataSelector ,options => { return options.map(option => option.textContent) });
    
    for (let index = 0; index < productNames.length; index++) {
        const productName = productNames[index];  
        
        expect(productName.toUpperCase()).toContain(batchAttributeProductContains.toUpperCase());            
    }  
    
    const mimeTypes = await page.$$eval(pageObjectsConfig.fileAttributeTableRecordSelector ,options => { return options.map(option => option.textContent) });
    
    for (let index = 0; index < mimeTypes.length; index++) {
        const mimeType = mimeTypes[index];  
        
        expect(mimeType.toUpperCase()).toContain(systemAttributeMimeType.toUpperCase());            
    }  

  })

  it('Test to verify grouping button is disabled', async () => {    
    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    const groupingBeforeAriaDisabled=await page.getAttribute(pageObjectsConfig.groupingButton,"aria-disabled");
    expect(groupingBeforeAriaDisabled).toEqual("true");   
    
  })

  it('Test to verify no value field displayed when select operator eq null or ne null for BatchExpiryDate', async () => {    
    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page,"BatchExpiryDate");
    //select operator eq null 
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"eq null");
    let valueField=await page.$$(pageObjectsConfig.inputSearchValueSelector);
    expect(valueField.length).toEqual(0);

    //select operator ne null 
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"ne null");
    valueField=await page.$$(pageObjectsConfig.inputSearchValueSelector);
    expect(valueField.length).toEqual(0); 
    
    
  })

  it('Test to verify no value field displayed when select operator eq null or ne null for BatchPublishedDate', async () => {    
    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page,"BatchPublishedDate");
    //select operator eq null 
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"eq null");
    let valueField=await page.$$(pageObjectsConfig.inputSearchValueSelector);
    expect(valueField.length).toEqual(0);

    //select operator ne null 
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"ne null");
    valueField=await page.$$(pageObjectsConfig.inputSearchValueSelector);
    expect(valueField.length).toEqual(0);     
    
  })

  it('Test to verify no value field displayed when select operator eq null or ne null for batch attributes', async () => {    
    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page,"product");
    //select operator eq null 
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"eq null");
    let valueField=await page.$$(pageObjectsConfig.inputSearchValueSelector);
    expect(valueField.length).toEqual(0);

    //select operator ne null 
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"ne null");
    valueField=await page.$$(pageObjectsConfig.inputSearchValueSelector);
    expect(valueField.length).toEqual(0);     
    
  })

  it('Test to verify pagination count for user attribute search', async () => {    
    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page,"product");
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"contains");     
    await page.fill(pageObjectsConfig.inputSearchValueSelector,batchAttributeProductContains);
    await page.click(pageObjectsConfig.searchAttributeButton);
    
    // Verification of attribute table records
    await page.waitForSelector(pageObjectsConfig.searchAttributeTable);
    const productNames = await page.$$eval(pageObjectsConfig.attributeTableDataSelector ,options => { return options.map(option => option.textContent) });
    
    for (let index = 0; index < productNames.length; index++) {
        const productName = productNames[index];  
        
        expect(productName.toUpperCase()).toContain(batchAttributeProductContains.toUpperCase());            
    }  
    
    //Get the product counts on UI
    const productsCount=productNames.length;    
    const paginatorText=await page.innerText(pageObjectsConfig.paginatorSelector);    
    expect(paginatorText).toContain(`Showing 1-${productsCount}`);
    
  })

  it('Test to verify file downloaded status changed after click on download button', async () => {        
   
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page,"product");
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"eq");  
    await page.waitForTimeout(1000);   
    await page.fill(pageObjectsConfig.inputSearchValueSelector,batchAttributeProduct);
    await page.click(pageObjectsConfig.searchAttributeButton);
    
    // Verifiction of attribute table 
    await page.waitForSelector(pageObjectsConfig.searchAttributeTable);

    //Click on expand button
    await page.click(pageObjectsConfig.chooseFileDownloadSelector);
  
    //Click on download button
    await page.click(pageObjectsConfig.fileDownloadButton);

    //Get the file downloaded status
    const fileDownloadStatus=await page.getAttribute(pageObjectsConfig.fileDownloadButtonStatus,"class");
    expect(fileDownloadStatus).toContain("check");    
  })

  it('Batch Attribute table returns records less than filesize search', async () => {    
    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page,"cellname");
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"eq");     
    await page.fill(pageObjectsConfig.inputSearchValueSelector,batchAttributeCellName);
    await page.click(pageObjectsConfig.buttonAddNewRow);

    await SearchAttributeSecondRow(page, "filesize");
    await page.selectOption(pageObjectsConfig.operatorDropDownSelectorSecondRow,"lt");     
    await page.fill(pageObjectsConfig.inputSearchValueSelectorSecondRow,batchAttributeFileSize.toString());

    await page.click(pageObjectsConfig.searchAttributeButton);
    
    // Verification of attribute table records
    await page.waitForSelector(pageObjectsConfig.searchAttributeTable);
    const cellNames = await page.$$eval(pageObjectsConfig.SystemAttributeCellName ,options => { return options.map(option => option.textContent) });
    
    for (let index = 0; index < cellNames.length; index++) {
        const cellName = cellNames[index];  
        
        expect(cellName.toUpperCase()).toEqual(batchAttributeCellName.toUpperCase());            
    }  
    
    const fileSizes = await page.$$eval(pageObjectsConfig.fileAttributeTableSizeSelector ,options => { return options.map(option => option.textContent) });
    
    for (let index = 0; index < fileSizes.length; index++) {
        const fileSize = fileSizes[index];
        var fileSizeInBytes=GetFileSizeInBytes(fileSize);                   
        expect(fileSizeInBytes).toBeLessThan(batchAttributeFileSize); 
                
    }  

  }) 

  it('Test to verify no result for search query', async () => {    
    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page,"cellname");
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"eq");     
    await page.fill(pageObjectsConfig.inputSearchValueSelector,batchAttributeCellName);
    await page.click(pageObjectsConfig.buttonAddNewRow);

    await SearchAttributeSecondRow(page, "filesize");
    await page.selectOption(pageObjectsConfig.operatorDropDownSelectorSecondRow,"eq");     
    await page.fill(pageObjectsConfig.inputSearchValueSelectorSecondRow,batchAttributeFileSize.toString());

    await page.click(pageObjectsConfig.searchAttributeButton);
    
    // Verify dialog info for no records
    const infoText=await page.innerText(pageObjectsConfig.dialogInfoSelector);    
    
    expect(infoText).toEqual(pageObjectsConfig.dialogInfoText);    

  })

  it('Test to verify warning message for invalid field value', async () => {    
    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page,"cellname");
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"eq");     
    await page.fill(pageObjectsConfig.inputSearchValueSelector,batchAttributeCellName);
    await page.click(pageObjectsConfig.buttonAddNewRow);

    await SearchAttributeSecondRow(page, "filesize");
    await page.selectOption(pageObjectsConfig.operatorDropDownSelectorSecondRow,"lt");     
    await page.fill(pageObjectsConfig.inputSearchValueSelectorSecondRow,'1000MB');

    await page.click(pageObjectsConfig.searchAttributeButton);
    
    // Verify warning message
    const warningMessage=await page.innerText(pageObjectsConfig.dialogWarningSelector);    
    
    expect(warningMessage).toEqual(pageObjectsConfig.dialogWarningText);    

  })

  it('Test to verify no result for "Sql Injection" query', async () => {    
    
    page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
    await SearchAttribute(page,"BusinessUnit");
    await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"eq");     
    await page.fill(pageObjectsConfig.inputSearchValueSelector,searchQuerySqlInjection);    

    await page.click(pageObjectsConfig.searchAttributeButton);
    
    // Verify dialog info for no records
    const infoText=await page.innerText(pageObjectsConfig.dialogInfoSelector);    
    
    expect(infoText).toEqual(pageObjectsConfig.dialogInfoText);    

  })

})