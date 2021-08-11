import { chromium, Browser, BrowserContext, Page } from 'playwright'
const { autoTestConfig } = require('../FunctionalTests/appSetting.json');
const { pageObjectsConfig,pageTimeOut } = require('../FunctionalTests/pageObjects.json');
import {LoginPortal,SearchAttribute} from '../FunctionalTests/helpermethod'
import{businessUnitValue,fileSizeValue} from './helperattributevalues'
import {GetApiDetails} from './apiRequest'



describe('FSS UI E2E Scenarios', () => {
    jest.setTimeout(pageTimeOut.timeOutInMilliSeconds);
    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
  
    beforeEach(async () => {
      browser = await chromium.launch({slowMo:100,headless:false});
      context = await browser.newContext();
      page = await context.newPage();
      await page.goto(autoTestConfig.url)
    })
  
    afterEach(async () => {
      await page.close()
      await context.close()
      await browser.close()
    }) 
    
    it('Valid search query to verify data returns on UI and API response status 200', async () => {

        page.click(pageObjectsConfig.searchButtonSelector);
        await LoginPortal(page,autoTestConfig.user, autoTestConfig.password);
    
        await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);
        expect(await page.innerHTML(pageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(pageObjectsConfig.searchPageContainerHeaderText);
        
        page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
        await SearchAttribute(page,"BusinessUnit");
        await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"eq"); 
        await page.fill(pageObjectsConfig.inputSearchValueSelector,businessUnitValue);
        await page.click(pageObjectsConfig.searchAttributeButton);
        
        // Verifiction of attribute table records
        await page.waitForSelector(pageObjectsConfig.searchAttributeTable);
        const noOfRecods=(await page.$$(pageObjectsConfig.searchAttributeTableRows)).length
        expect(noOfRecods).toBeGreaterThanOrEqual(2);

        //Get the token from local storage once user logged in
        const idToken=await page.evaluate(()=>{return localStorage.getItem('idToken')})

        //Search Query String
        const queryString=`BusinessUnit eq '${businessUnitValue}'`
        
        //Validate api response status code matches 200 
        await GetApiDetails(autoTestConfig.apiurl,queryString,idToken!,200);
    
      })

      it('Invalid search query to verify data returns on UI and API response status 400', async () => {

        page.click(pageObjectsConfig.searchButtonSelector);
        await LoginPortal(page,autoTestConfig.user, autoTestConfig.password);
    
        await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);
        expect(await page.innerHTML(pageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(pageObjectsConfig.searchPageContainerHeaderText);
        
        page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
        await SearchAttribute(page,"FileSize");
        await page.selectOption(pageObjectsConfig.operatorDropDownSelector,"eq"); 
        await page.fill(pageObjectsConfig.inputSearchValueSelector,`'${fileSizeValue}'`);
        await page.click(pageObjectsConfig.searchAttributeButton);
        
        //Verification of warning message
        await page.waitForSelector(pageObjectsConfig.warningMessageSelector);
        const warningMessage=await page.innerText(pageObjectsConfig.warningMessageSelector);
        
        expect(warningMessage).toContain(pageObjectsConfig.warningMessageText);

        //Get the token from local storage once user logged in
        const idToken=await page.evaluate(()=>{return localStorage.getItem('idToken')})

        //Search Query String
        const queryString=`FileSize eq '${fileSizeValue}'`
        
        //Validate api response status code matches 400 
        await GetApiDetails(autoTestConfig.apiurl,queryString,idToken!,400);
    
      })
}) 