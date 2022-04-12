const { autoTestConfig } = require('./appSetting');
const { pageObjectsConfig, pageTimeOut } = require('./pageObjects');
import {AcceptCookies, InsertSearchText,
  ExpectAllResultsHaveBatchUserAttValue,
  ExpectAllResultsContainAnyBatchUserAttValue,
  GetTotalResultCount,GetSpecificAttributeCount,filterCheckBox,ExpectAllResultsContainBatchUserAttValue} from './helpermethod';
import {attributeProductType, searchNonExistBatchAttribute,batchAttributeKeys,attributeMediaType,attributeMultipleMediaTypes} from './helperconstant';

describe('Test Search Result Scenario On Simplified Search Page', () => {
  jest.setTimeout(pageTimeOut.timeOutInMilliSeconds);

  beforeEach(async () => { 
    await page.goto(autoTestConfig.url)
    await AcceptCookies(page);
    
    await page.waitForSelector(pageObjectsConfig.searchPageContainerHeaderSelector);
    expect(await page.innerHTML(pageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(pageObjectsConfig.searchPageContainerHeaderText);

  })
 
  it('Verify No results for non existing batch attribute value search', async () => {
    //Enter non existing value in search box
    await InsertSearchText(page, searchNonExistBatchAttribute); 
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
    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);

    // verify paginator links are available on the page
    expect(await page.isVisible(pageObjectsConfig.paginatorLinkPrevious)).toBeTruthy();
    expect(await page.isVisible(pageObjectsConfig.paginatorLinkNext)).toBeTruthy();
    
  })

  it('Verify paginator text showing correct values for search results on first page', async () => {
    await InsertSearchText(page, attributeProductType.value);    
    
    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);
    const recordCount = await GetTotalResultCount(page);
    const paginatorText = await page.innerText(pageObjectsConfig.paginatorTextSelector);

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
    const searchText = `L1K2 ${attributeProductType.value}`;
    await InsertSearchText(page, searchText);
    
    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);
    const batchAttributesValue = searchText.split(' ');
    await ExpectAllResultsContainAnyBatchUserAttValue(page, batchAttributesValue);
  })
  
  it('Verify file downloaded status changed after click on download button', async () => {
    await InsertSearchText(page, attributeProductType.value);    
    
    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);

    //verify Choose files to download and  Download buttons are available on the page
    expect(await page.isVisible(pageObjectsConfig.chooseFileDownloadSelector)).toBeTruthy();
        
     //Click on expand button
     await page.click(pageObjectsConfig.chooseFileDownloadSelector);
  
     //Click on download button
     await page.click(pageObjectsConfig.fileDownloadButton, {force: true});
 
     //Get the file downloaded status
     const fileDownloadStatus=await page.getAttribute(pageObjectsConfig.fileDownloadButtonStatus,"class");
     expect(fileDownloadStatus).toContain("check");    
  })

  it('Verify search results specific batch attributes Not displayed on filter panel', async () => {
    await InsertSearchText(page, attributeProductType.value);

    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);
    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);

    const filterSpeficAttributeCount=await GetSpecificAttributeCount(page, attributeProductType.key, attributeProductType.value );
    
    expect(filterSpeficAttributeCount).toEqual(0);    
    
  })

  it('Verify configured batch attributes will be displayed on the filter panel', async () => {
    await InsertSearchText(page, attributeMultipleMediaTypes.value);

    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);
    await ExpectAllResultsContainAnyBatchUserAttValue(page, attributeMultipleMediaTypes.value.split(' '));

    const configuredBatchAttibutes=await page.$$eval(pageObjectsConfig.filterBatchAttributes ,elements => { return elements.map(element => element.textContent) });
    const filterCount=configuredBatchAttibutes.length;
    if(filterCount>0)
    {
      for(let i=0; i<filterCount;i++)
      {
        expect(batchAttributeKeys.includes(configuredBatchAttibutes[i])).toBeTruthy();
        //filter values count should be more than one
        const batchAttibutesValues=await page.$$eval(`[aria-label='${configuredBatchAttibutes[i]}'] label` ,elements => { return elements.map(element => element.textContent) });
        expect(batchAttibutesValues.length).toBeGreaterThan(1);
    }   
          
    }    
    
  })

  it('Verify batch attributes filter can select or deselect', async () => {
    await InsertSearchText(page, attributeMultipleMediaTypes.value);

    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);
    await ExpectAllResultsContainAnyBatchUserAttValue(page, attributeMultipleMediaTypes.value.split(' '));

    const [attrCD, attrDVD] =attributeMultipleMediaTypes.value.split(' ');
    //select filter check box 
    await page.check(await filterCheckBox(attributeMultipleMediaTypes.key, attrCD));
    await page.check(await filterCheckBox(attributeMultipleMediaTypes.key, attrDVD)); 
    
    // Assert the filter checked state
    expect(await page.isChecked(await filterCheckBox(attributeMultipleMediaTypes.key, attrCD))).toBeTruthy()
    expect(await page.isChecked(await filterCheckBox(attributeMultipleMediaTypes.key, attrDVD))).toBeTruthy()   
  
   //clicks on clear filter buttton
    await page.click(pageObjectsConfig.clearFilterButton);

    // Assert the filter checked state
    expect(await page.isChecked(await filterCheckBox(attributeMultipleMediaTypes.key, attrCD))).toBeFalsy()
    expect(await page.isChecked(await filterCheckBox(attributeMultipleMediaTypes.key, attrDVD))).toBeFalsy()   
  
  })

  it('Select batch attributes filter and clicks on Apply filters button and refine the search', async () => {
    await InsertSearchText(page, attributeMultipleMediaTypes.value);

    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);
    await ExpectAllResultsContainAnyBatchUserAttValue(page, attributeMultipleMediaTypes.value.split(' '));
    //select batch attributes filter
    await page.check(await filterCheckBox(attributeMultipleMediaTypes.key, attributeMultipleMediaTypes.value.split(' ')[0]));
    
    // Assert the filter checked state
    expect(await page.isChecked(await filterCheckBox(attributeMultipleMediaTypes.key, attributeMultipleMediaTypes.value.split(' ')[0]))).toBeTruthy()
   
   //clicks on clear filter buttton
    await page.click(pageObjectsConfig.applyFilterButton);

    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);
    await ExpectAllResultsContainBatchUserAttValue(page,attributeMultipleMediaTypes.value.split(' ')[0]);
      
  })

})