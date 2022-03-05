const { autoTestConfig } = require('./appSetting');
const { pageObjectsConfig, pageTimeOut } = require('./pageObjects');
import {AcceptCookies, DataCollectionComparison,InsertSearchText,
  ExpectAllResultsHaveBatchAttributeValue,
  ExpectAllResultsContainOneBatchAttributeValue} from './helpermethod';
import {searchMultipleBatchAttributes,searchNonExistBatchAttribute} from './helperconstant';
import {attributeProductType} from './helperattributevalues';

describe('Test Search Result Scenario On Simplified Search Page', () => {
  jest.setTimeout(pageTimeOut.timeOutInMilliSeconds);

  beforeEach(async () => { 
    await page.goto(autoTestConfig.url)
    await AcceptCookies(page);
    
    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);
    expect(await page.innerHTML(pageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(pageObjectsConfig.searchPageContainerHeaderText);

    await page.click(pageObjectsConfig.simplifiedSearchLinkSelector);
  })
 
  it('Verify No results for non existing batch attribute value search', async () => {
    //Enter non existing value in search box
    await InsertSearchText(page,searchNonExistBatchAttribute); 
    try{ 
         await page.waitForSelector(pageObjectsConfig.dialogInfoSelector);

       }catch{
        await page.click(pageObjectsConfig.simplifiedSearchButtonSelector);
        await page.waitForSelector(pageObjectsConfig.dialogInfoSelector);
       }
  
    const infoText=await page.innerText(pageObjectsConfig.dialogInfoSelector);    
    
    expect(infoText).toEqual(pageObjectsConfig.dialogInfoText);    
    
  })
  
  it('Verify search results for single batch attribute search', async () => {
    await InsertSearchText(page, attributeProductType.value);

    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);
    await ExpectAllResultsHaveBatchAttributeValue(page, attributeProductType.value);

    // verify paginator links are available on the page
    expect(await page.isVisible(pageObjectsConfig.paginatorLinkPrevious)).toBeTruthy();
    expect(await page.isVisible(pageObjectsConfig.paginatorLinkNext)).toBeTruthy();
    
  })

  it('Verify paginator text showing correct values for search results on first page', async () => {
    await InsertSearchText(page, attributeProductType.value);    
    
    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);
    var totalResult=await page.innerText(pageObjectsConfig.totalResultCountSelector);
    //get the total batches count
    var recordCount=parseInt(totalResult.split(" ")[0]);

    var paginatorText=await page.innerText(pageObjectsConfig.paginatorTextSelector);

    if (recordCount<=10)
    {
        expect(paginatorText).toEqual(`Showing 1-${recordCount} of ${recordCount}`);         
    }
    else
    {
        expect(paginatorText).toEqual(`Showing 1-10 of ${recordCount}`);
    }   
    
  })

  it('Verify search results for multiple batch attributes search', async () => {
    const searchText = `ZZ ${attributeProductType.value}`;
    await InsertSearchText(page, searchText);
   
    const batchAttributesValue = searchText.split(' ');
    await ExpectAllResultsContainOneBatchAttributeValue(page, batchAttributesValue);
  })
  
  it('Verify file downloaded status changed after click on download button', async () => {
    await InsertSearchText(page, attributeProductType.value);    
    
    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);

    //verify Choose files to download and  Download buttons are available on the page
    expect(await page.isVisible(pageObjectsConfig.chooseFileDownloadSelector)).toBeTruthy();
    expect(await page.isVisible(pageObjectsConfig.fileDownloadButton)).toBeTruthy();    
    
     //Click on expand button
     await page.click(pageObjectsConfig.chooseFileDownloadSelector);
  
     //Click on download button
     await page.click(pageObjectsConfig.fileDownloadButton);
 
     //Get the file downloaded status
     const fileDownloadStatus=await page.getAttribute(pageObjectsConfig.fileDownloadButtonStatus,"class");
     expect(fileDownloadStatus).toContain("check");    
  })

})