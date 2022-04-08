const { autoTestConfig } = require('./appSetting');
const { pageObjectsConfig, pageTimeOut } = require('./pageObjects');
import {AcceptCookies, InsertSearchText,
  ExpectAllResultsHaveBatchUserAttValue,
  ExpectAllResultsContainAnyBatchUserAttValue,
  GetTotalResultCount,GetSpecificAttributeCount,filterCheckBox,ExpectAllResultsContainBatchUserAttValue,ExpectSpecificColumnValueDisplayed} from './helpermethod';
import {attributeProductType, searchNonExistBatchAttribute,batchAttributeKeys,attributeMediaType,attributeMultipleMediaType} from './helperconstant';

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

  it('Verify search results specific batch attributes on filter panel', async () => {
    await InsertSearchText(page, attributeProductType.value);

    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);
    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);

    const filterSpeficAttributeCount=await GetSpecificAttributeCount(page, attributeProductType.key, attributeProductType.value );
    
    expect(filterSpeficAttributeCount).toEqual(1);    
    
  })

  it('Verify configured batch attributes will be displayed on the filter panel', async () => {
    await InsertSearchText(page, attributeProductType.value);

    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);
    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);

    const configuredBatchAttibutes=await page.$$eval(pageObjectsConfig.filterBatchAttributes ,elements => { return elements.map(element => element.textContent) });
    
    var match = (batchAttributeKeys.length == configuredBatchAttibutes.length) && batchAttributeKeys.every(function(element, index) {
      return element === configuredBatchAttibutes[index]; 
     });
  
    expect(match).toBeTruthy();           
    
  })

  it('Verify batch attributes filter can select or deselect', async () => {
    await InsertSearchText(page, attributeProductType.value);

    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);
    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);
    //select filter check box 
    await page.check(await filterCheckBox(attributeProductType.key, attributeProductType.value));
    await page.check(await filterCheckBox(attributeMediaType.key, attributeMediaType.value)); 
    
    // Assert the filter checked state
    expect(await page.isChecked(await filterCheckBox(attributeProductType.key, attributeProductType.value))).toBeTruthy()
    expect(await page.isChecked(await filterCheckBox(attributeMediaType.key, attributeMediaType.value))).toBeTruthy()   
  
   //clicks on clear filter buttton
    await page.click(pageObjectsConfig.clearFilterButton);

    // Assert the filter checked state
    expect(await page.isChecked(await filterCheckBox(attributeProductType.key, attributeProductType.value))).toBeFalsy()
    expect(await page.isChecked(await filterCheckBox(attributeMediaType.key, attributeMediaType.value))).toBeFalsy()   
  
  })

  it('Select batch attributes filter and clicks on Apply filters button and refine the search', async () => {
    await InsertSearchText(page, attributeProductType.value);

    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);
    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);
    //select batch attributes filter
    await page.check(await filterCheckBox(attributeProductType.key, attributeProductType.value));
    await page.check(await filterCheckBox(attributeMediaType.key, attributeMediaType.value)); 
    
    // Assert the filter checked state
    expect(await page.isChecked(await filterCheckBox(attributeProductType.key, attributeProductType.value))).toBeTruthy()
    expect(await page.isChecked(await filterCheckBox(attributeMediaType.key, attributeMediaType.value))).toBeTruthy()   
  
   //clicks on clear filter buttton
    await page.click(pageObjectsConfig.applyFilterButton);

    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);
    await ExpectAllResultsContainBatchUserAttValue(page,attributeProductType.value);
    await ExpectAllResultsContainBatchUserAttValue(page,attributeMediaType.value);  
  })

  it('Search multiple batch attributes and select filter and Apply filters button returned refined search', async () => {
    await InsertSearchText(page, attributeMultipleMediaType.value);  

    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);

    await ExpectAllResultsContainAnyBatchUserAttValue(page, attributeMultipleMediaType.value.split(' '));

    const [attributeValueCD, attributeValueDVD]=attributeMultipleMediaType.value.split(' ');    
    

    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);
    //select batch attributes CD checkbox
    await page.check(await filterCheckBox(attributeMultipleMediaType.key, attributeValueCD));
   
    //clicks on apply filter buttton
    await page.click(pageObjectsConfig.applyFilterButton); 
     
    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);

    // Verify all rescords belongs to media type value CD
    await ExpectSpecificColumnValueDisplayed(page,attributeMultipleMediaType.key,attributeValueCD);

    //uncheck batch attributes CD checkbox
    await page.uncheck(await filterCheckBox(attributeMultipleMediaType.key, attributeValueCD));

    //select batch attributes DVD checkbox
    await page.check(await filterCheckBox(attributeMultipleMediaType.key, attributeValueDVD));

    //clicks on apply filter buttton
    await page.click(pageObjectsConfig.applyFilterButton); 
     
    await page.waitForSelector(pageObjectsConfig.searchResultTableSelector);

     // Verify all rescords belongs to media type value DVD
     await ExpectSpecificColumnValueDisplayed(page,attributeMultipleMediaType.key,attributeValueDVD);
     
  })

})