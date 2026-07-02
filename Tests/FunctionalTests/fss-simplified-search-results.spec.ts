import { test, expect } from '@playwright/test';
import { autoTestConfig } from '../../appSetting.json';
import { fssSearchPageObjectsConfig } from '../../PageObjects/fss-searchpageObjects.json';
import { AcceptCookies, LoginPortal } from '../../Helper/CommonHelper';
import {
  ExpectAllResultsHaveBatchUserAttValue, ExpectAllResultsContainAnyBatchUserAttValue,
  InsertSearchText, AdmiraltyExpectAllResultsHaveFileAttributeValue,
  GetTotalResultCount, GetSpecificAttributeCount, ExpectAllResultsContainAnyBatchUserAndFileNameAttValue
} from '../../Helper/SearchPageHelper';
import { attributeProductType, searchNonExistBatchAttribute, batchAttributeKeys, attributeFileName } from '../../Helper/ConstantHelper';

async function waitForSimplifiedResultsReady(page: any): Promise<void> {
  await expect.poll(async () => await page.locator(fssSearchPageObjectsConfig.searchResultTableSelector).count(), {
    timeout: 60000
  }).toBeGreaterThan(0);
}

async function getFirstTwoFilterValues(page: any): Promise<[string, string]> {
  const labels = page.locator('admiralty-filter admiralty-checkbox');
  const count = await labels.count();
  expect(count).toBeGreaterThan(1);

  const first = ((await labels.nth(0).textContent()) ?? '').trim();
  const second = ((await labels.nth(1).textContent()) ?? '').trim();

  expect(first.length).toBeGreaterThan(0);
  expect(second.length).toBeGreaterThan(0);

  return [first, second];
}

async function expandUntilFileDownloadButton(page: any): Promise<any> {
  const sectionButtons = page.getByRole('button', { name: /Choose files to download/i });
  const sectionsCount = await sectionButtons.count();

  for (let i = 0; i < sectionsCount; i++) {
    await sectionButtons.nth(i).click();
    const fileButton = page.locator('[data-testid^="fd-button-test-id-"]').first();
    const visible = await fileButton.isVisible().catch(() => false);
    if (visible) {
      return fileButton;
    }
  }

  throw new Error('No visible file download button was found after expanding all batch sections.');
}

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
    const searchText = 'Notices 25';
    await InsertSearchText(page, searchText);
    await page.waitForSelector(fssSearchPageObjectsConfig.searchResultTableSelector);
    const batchAttributesValue = searchText.split(' ');
    await ExpectAllResultsContainAnyBatchUserAttValue(page, batchAttributesValue);
  })

  test('Verify file downloaded status changed after click on download button', async ({ page }) => {
    await InsertSearchText(page, 'Notices 25');
    await waitForSimplifiedResultsReady(page);

    //verify at least one expandable files section exists
    expect(await page.getByRole('button', { name: /Choose files to download/i }).count()).toBeGreaterThan(0);
    const downloadButton = await expandUntilFileDownloadButton(page);
    //Click on download button
    await downloadButton.click();
    //Get the file downloaded status
    await expect.poll(async () => await page.getAttribute(fssSearchPageObjectsConfig.fileDownloadButtonStatus, "class"), {
      timeout: 60000
    }).toContain("check");
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
    await InsertSearchText(page, 'Notices 25');
    await waitForSimplifiedResultsReady(page);
    await ExpectAllResultsContainAnyBatchUserAndFileNameAttValue(page, ['Notices', '25']);

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
    await InsertSearchText(page, 'Notices 25');
    await waitForSimplifiedResultsReady(page);
    await ExpectAllResultsContainAnyBatchUserAndFileNameAttValue(page, ['Notices', '25']); 
    const [attrCD, attrDVD] = await getFirstTwoFilterValues(page);

    //select filter check box 
    await page.locator('admiralty-checkbox').filter({ hasText: attrCD }).locator('div').click();
    await page.locator('admiralty-checkbox').filter({ hasText: attrDVD }).locator('div').click();

    // Assert the filter checked state
    await expect(page.getByTestId(attrCD).locator('div input')).toBeChecked({ timeout: 60000 });
    await expect(page.getByTestId(attrDVD).locator('div input')).toBeChecked({ timeout: 60000 });

    //clicks on clear filter buttton
    await page.click(fssSearchPageObjectsConfig.clearFilterButton);

    // Assert the filter checked state
    await expect(page.getByTestId(attrCD).locator('div input')).not.toBeChecked({ timeout: 60000 });
    await expect(page.getByTestId(attrDVD).locator('div input')).not.toBeChecked({ timeout: 60000 });


  })

  test('Select batch attributes filter and clicks on Apply filters button and refine the search', async ({ page }) => {
    const searchText = 'Notices 25';
    await InsertSearchText(page, searchText);
    await waitForSimplifiedResultsReady(page);
    await ExpectAllResultsContainAnyBatchUserAndFileNameAttValue(page, searchText.split(' '));
    const initialResultCount = await GetTotalResultCount(page);

    //select batch attributes filter
    const [requiredMediaType] = await getFirstTwoFilterValues(page);
    await page.locator('admiralty-checkbox').filter({ hasText: requiredMediaType }).locator('div').click();

    // Assert the filter checked state
    await expect(page.locator('admiralty-checkbox').filter({ hasText: requiredMediaType }).locator('div input')).toBeChecked({ timeout: 60000 });

    //clicks on clear filter buttton
    await page.click(fssSearchPageObjectsConfig.applyFilterButton);

    await waitForSimplifiedResultsReady(page);
    const filteredResultCount = await GetTotalResultCount(page);
    expect(filteredResultCount).toBeGreaterThan(0);
    expect(filteredResultCount).toBeLessThanOrEqual(initialResultCount);

  })

  test('Search multiple batch attributes and select filter and Apply filters button returned refined search', async ({ page }) => {
    const searchText = 'Notices 25';
    await InsertSearchText(page, searchText);
    await waitForSimplifiedResultsReady(page);
    await ExpectAllResultsContainAnyBatchUserAndFileNameAttValue(page, searchText.split(' ')); //RHZ 
    const initialResultCount = await GetTotalResultCount(page);

    const [firstFilterValue, secondFilterValue] = await getFirstTwoFilterValues(page);
    //select first filter checkbox
    await page.locator('admiralty-checkbox').filter({ hasText: firstFilterValue }).locator('div').click();

    //clicks on apply filter buttton
    await page.getByRole('button', { name: 'Apply filters' }).click();

    await waitForSimplifiedResultsReady(page);

    // Verify the first apply action keeps a valid refined result set
    const firstFilteredResultCount = await GetTotalResultCount(page);
    expect(firstFilteredResultCount).toBeGreaterThan(0);
    expect(firstFilteredResultCount).toBeLessThanOrEqual(initialResultCount);

    //uncheck first filter checkbox
    await page.locator('admiralty-checkbox').filter({ hasText: firstFilterValue }).locator('div').click();

    //select second filter checkbox
    await page.locator('admiralty-checkbox').filter({ hasText: secondFilterValue }).locator('div').click();
    //clicks on apply filter buttton
    await page.getByRole('button', { name: 'Apply filters' }).click();

    await waitForSimplifiedResultsReady(page);

    // Verify the second apply action also keeps a valid refined result set
    const secondFilteredResultCount = await GetTotalResultCount(page);
    expect(secondFilteredResultCount).toBeGreaterThan(0);
    expect(secondFilteredResultCount).toBeLessThanOrEqual(initialResultCount);

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
