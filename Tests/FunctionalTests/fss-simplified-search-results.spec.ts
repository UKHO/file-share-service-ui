import { test, expect } from '@playwright/test';
import { autoTestConfig } from '../../appSetting.json';
import { fssSearchPageObjectsConfig } from '../../PageObjects/fss-searchpageObjects.json';
import { AcceptCookies, LoginPortal } from '../../Helper/CommonHelper';
import {
  ExpectAllResultsHaveBatchUserAttValue, ExpectAllResultsContainAnyBatchUserAttValue,
  ExpectAllResultsContainBatchUserAttValue, InsertSearchText, ExpectSpecificColumnValueDisplayed, AdmiraltyExpectAllResultsHaveFileAttributeValue,
  GetTotalResultCount, GetSpecificAttributeCount, ExpectAllResultsContainAnyBatchUserAndFileNameAttValue,ExpectAllResultsHaveFileAttributeValue
} from '../../Helper/SearchPageHelper';
import { attributeProductType, searchNonExistBatchAttribute, batchAttributeKeys, attributeMultipleMediaTypes, attributeMultipleMediaType,attributeFileName } from '../../Helper/ConstantHelper';

test.describe('Test Search Result Scenario On Simplified Search Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(autoTestConfig.url)
    await AcceptCookies(page);
    await LoginPortal(page, autoTestConfig.user, autoTestConfig.password);
    await page.waitForSelector(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector);
    expect(await page.innerHTML(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector)).toEqual(fssSearchPageObjectsConfig.searchPageContainerHeaderText);

  })

  test('Verify No results for non existing batch attribute value search', async ({ page }) => {
    //Enter non existing value in search box
    await InsertSearchText(page, searchNonExistBatchAttribute);
    const infoText = await page.locator(fssSearchPageObjectsConfig.dialogTitleSelector).innerText();
    expect(infoText).toContain(fssSearchPageObjectsConfig.dialogInfoText);

  })

  //https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14327
  test('Verify search results for single batch attribute search', async ({ page }) => {
    await InsertSearchText(page, attributeProductType.value);

    await page.waitForSelector(fssSearchPageObjectsConfig.searchResultTableSelector);
    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);
    // verify paginator links are available on the page
    expect(await page.getByRole('button', { name: fssSearchPageObjectsConfig.paginatorLinkNext })).toBeTruthy();
    expect(await page.getByRole('button', { name: fssSearchPageObjectsConfig.paginatorLinkPrevious })).toBeTruthy();

  })

  test('Verify paginator text showing correct values for search results on first page', async ({ page }) => {
    await InsertSearchText(page, attributeProductType.value);
    await page.waitForSelector(fssSearchPageObjectsConfig.searchResultTableSelector);
    const recordCount = await GetTotalResultCount(page);
    const paginatorText = await page.innerText(fssSearchPageObjectsConfig.paginatorTextSelector);
    if (recordCount <= 10) {
      expect(paginatorText).toEqual(`Showing 1-${recordCount} of ${recordCount}`);
    }
    else {
      expect(paginatorText).toEqual(`Showing 1-10 of ${recordCount}`);
    }

  })

  test('Verify search results for multiple batch attributes search', async ({ page }) => {
    const searchText = `L1K2 ${attributeProductType.value}`;
    await InsertSearchText(page, searchText);
    await page.waitForSelector(fssSearchPageObjectsConfig.searchResultTableSelector);
    const batchAttributesValue = searchText.split(' ');
    await ExpectAllResultsContainAnyBatchUserAttValue(page, batchAttributesValue);
  })

  test('Verify file downloaded status changed after click on download button', async ({ page }) => {
    await InsertSearchText(page, attributeProductType.value);
    await page.waitForSelector(fssSearchPageObjectsConfig.searchResultTableSelector);

    //verify Choose files to download and  Download buttons are available on the page
    expect(await page.isVisible(fssSearchPageObjectsConfig.chooseFileDownloadSelector)).toBeTruthy();
    //Click on expand button
    await page.click(fssSearchPageObjectsConfig.chooseFileDownloadSelector);
    //Click on download button
    //await page.click(fssSearchPageObjectsConfig.fileDownloadButton, { force: true });
    page.getByTestId(fssSearchPageObjectsConfig.fileDownloadButtonTestId).click();
    //Get the file downloaded status
    const fileDownloadStatus = await page.getAttribute(fssSearchPageObjectsConfig.fileDownloadButtonStatus, "class");
    expect(fileDownloadStatus).toContain("check");
  })

  test('Verify search results specific batch attributes Not displayed on filter panel', async ({ page }) => {
    await InsertSearchText(page, attributeProductType.value);
    await page.waitForSelector(fssSearchPageObjectsConfig.searchResultTableSelector);
    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);
    const filterSpeficAttributeCount = await GetSpecificAttributeCount(page, attributeProductType.key, attributeProductType.value);
    expect(filterSpeficAttributeCount).toEqual(0);

  })

  // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14329
  test('Verify batch attributes with multiple values are displayed on filter panel', async ({ page }) => {
    await InsertSearchText(page, attributeMultipleMediaType.value);
    await page.waitForSelector(fssSearchPageObjectsConfig.searchResultTableSelector);
    await ExpectAllResultsContainAnyBatchUserAndFileNameAttValue(page, attributeMultipleMediaType.value.split(' '));

    const configuredBatchAttibutes = await page.$$eval('admiralty-filter h3', elements => { return elements.map(element => element.textContent) })
    const filterCount = configuredBatchAttibutes.length;
    expect(filterCount).toBeGreaterThan(0);

    for (let i = 0; i < filterCount; i++) {
      expect(batchAttributeKeys.includes(configuredBatchAttibutes[i])).toBeTruthy();
      //filter values count should be more than one
      const batchAttibutesValues = await page.$$eval(`//admiralty-filter//admiralty-expansion[contains(., '${configuredBatchAttibutes[i]}')]//admiralty-checkbox`, elements => { return elements.map(element => element.textContent) });
      expect(batchAttibutesValues.length).toBeGreaterThan(1);
    }

  })

  test('Verify batch attributes filter can select or deselect', async ({ page }) => {
    await InsertSearchText(page, attributeMultipleMediaType.value);
    await page.waitForSelector(fssSearchPageObjectsConfig.searchResultTableSelector);
    await ExpectAllResultsContainAnyBatchUserAndFileNameAttValue(page, attributeMultipleMediaType.value.split(' ')); 
    const [attrCD, attrDVD] = attributeMultipleMediaType.value.split(' ');

    //select filter check box 
    await page.locator('admiralty-checkbox').filter({ hasText: attrCD }).locator('div').click();
    await page.locator('admiralty-checkbox').filter({ hasText: attrDVD }).locator('div').click();

    // Assert the filter checked state
    expect(await page.locator('admiralty-checkbox').filter({ hasText: attrCD }).locator('div').isChecked()).toBeTruthy();
    expect(await page.locator('admiralty-checkbox').filter({ hasText: attrDVD }).locator('div').isChecked()).toBeTruthy();

    //clicks on clear filter buttton
    await page.click(fssSearchPageObjectsConfig.clearFilterButton);

    // Assert the filter checked state
    expect(await page.locator('admiralty-checkbox').filter({ hasText: attrCD }).locator('div').isChecked()).toBeFalsy();
    expect(await page.locator('admiralty-checkbox').filter({ hasText: attrDVD }).locator('div').isChecked()).toBeFalsy();


  })

  test('Select batch attributes filter and clicks on Apply filters button and refine the search', async ({ page }) => {
    await InsertSearchText(page, attributeMultipleMediaTypes.value);
    await page.waitForSelector(fssSearchPageObjectsConfig.searchResultTableSelector);
    await ExpectAllResultsContainAnyBatchUserAndFileNameAttValue(page, attributeMultipleMediaTypes.value.split(' '));
    //select batch attributes filter
    await page.locator('admiralty-checkbox').filter({ hasText: attributeMultipleMediaTypes.value.split(' ')[0] }).locator('div').click();

    // Assert the filter checked state
    const cbChecked = await page.locator('admiralty-checkbox').filter({ hasText: attributeMultipleMediaTypes.value.split(' ')[0] }).locator('div').isChecked();
    expect(cbChecked).toBeTruthy();

    //clicks on clear filter buttton
    await page.click(fssSearchPageObjectsConfig.applyFilterButton);

    await page.waitForSelector(fssSearchPageObjectsConfig.searchResultTableSelector);
    await ExpectAllResultsContainBatchUserAttValue(page, attributeMultipleMediaTypes.value.split(' ')[0]);

  })

  test('Search multiple batch attributes and select filter and Apply filters button returned refined search', async ({ page }) => {
    await InsertSearchText(page, attributeMultipleMediaType.value);
    await page.waitForSelector(fssSearchPageObjectsConfig.searchResultTableSelector);
    await ExpectAllResultsContainAnyBatchUserAndFileNameAttValue(page, attributeMultipleMediaType.value.split(' ')); //RHZ 

    const [attributeValueCD, attributeValueDVD] = attributeMultipleMediaType.value.split(' ');
    //select batch attributes CD checkbox
    await page.getByTestId(attributeValueCD).click();

    //clicks on apply filter buttton
    await page.getByRole('button', { name: 'Apply filters' }).click();

    await page.waitForSelector(fssSearchPageObjectsConfig.searchResultTableSelector);

    // Verify all rescords belongs to media type value CD
    await ExpectSpecificColumnValueDisplayed(page, attributeMultipleMediaType.key, attributeValueCD);

    //uncheck batch attributes CD checkbox
    await page.getByTestId(attributeValueCD).click();

    //select batch attributes DVD checkbox
    await page.getByTestId(attributeValueDVD).click();
    //clicks on apply filter buttton
    await page.getByRole('button', { name: 'Apply filters' }).click();

    await page.waitForSelector(fssSearchPageObjectsConfig.searchResultTableSelector);

    // Verify all rescords belongs to media type value DVD
    await ExpectSpecificColumnValueDisplayed(page, attributeMultipleMediaType.key, attributeValueDVD); 

  })

  //https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14328
  test('Verify search results for single File name search', async ({ page }) => {
    await InsertSearchText(page, attributeFileName.value);
    await page.click(fssSearchPageObjectsConfig.chooseFileDownloadSelector);
    //======================================
    await page.waitForTimeout(2000);
    await expect(page.getByText(attributeFileName.value).first()).toBeVisible();

    //=======================================
    await AdmiraltyExpectAllResultsHaveFileAttributeValue(page, attributeFileName.value);
    // verify paginator links are available on the page
    expect(await page.getByRole('button', { name: fssSearchPageObjectsConfig.paginatorLinkNext })).toBeTruthy();
    expect(await page.getByRole('button', { name: fssSearchPageObjectsConfig.paginatorLinkPrevious })).toBeTruthy();

  })
  
})
