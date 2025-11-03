import { test, expect } from '@playwright/test';
import { autoTestConfig } from '../../appSetting.json';
import { attributeBusinessUnit, attributeProductType, attributeFileSize} from '../../Helper/ConstantHelper';
import { SearchAttribute,ExpectAllResultsHaveBatchUserAttValue, ClickWaitRetry } from '../../Helper/SearchPageHelper';
import { AcceptCookies,LoginPortal } from '../../Helper/CommonHelper';
import { fssSearchPageObjectsConfig } from '../../PageObjects/fss-searchpageObjects.json';

let idToken: string | null;
test.describe('FSS UI E2E Scenarios', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(autoTestConfig.url);
    await AcceptCookies(page);
    page.waitForNavigation();
    await LoginPortal(page, autoTestConfig.user, autoTestConfig.password);
    await page.waitForSelector(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector);
    expect(await page.innerHTML(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector))
      .toEqual(fssSearchPageObjectsConfig.searchPageContainerHeaderText);
    await page.waitForTimeout(2000);
    await page.getByTestId(fssSearchPageObjectsConfig.advancedSearchLinkTestId).click();
    // Get the token from local storage once user logged in
    idToken = await page.evaluate(() => { return localStorage.getItem('idToken') });
    idToken?.replace(/["]+/g, '');
  })

  test('Valid search system attributes query to verify data returns on UI and API response status 200', async ({ request, page }) => {
    await SearchAttribute(page, attributeBusinessUnit.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, "eq");
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, attributeBusinessUnit.value);
    await page.getByTestId('adv-search-button').click();
    // Verification of attribute table records
    const card = page.locator("admiralty-card").first();
    const table = card.locator(".attribute-table"); 
    await page.waitForTimeout(500);
    const noOfRecods = await table.getByRole("row").count();
    expect(noOfRecods).toBeGreaterThanOrEqual(2);
    // Search Query String
    const queryString = `${attributeBusinessUnit.key} eq '${attributeBusinessUnit.value}'`;
    const testUrl = `${autoTestConfig.apiurl}/batch?$filter=${queryString}`;
    //Get operation   
    const apiResponse = await request.get(testUrl, { headers: { 'Authorization': `Bearer ${idToken}`
      }
    });
    expect(apiResponse.status()).toBe(200);
  });

  test('Valid search user attributes query to verify data returns on UI and API response status 200', async ({ request, page }) => {
    await SearchAttribute(page, attributeProductType.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, "eq");
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, attributeProductType.value);
    await page.getByTestId('adv-search-button').click();
    await ExpectAllResultsHaveBatchUserAttValue(page, attributeProductType.value);
    // Search Query String
    const queryString = `$batch("${attributeProductType.key}") eq '${attributeProductType.value}'`;
    const testUrl = `${autoTestConfig.apiurl}/batch?$filter=${queryString}`;    
    //Get operation   
    const apiResponse = await request.get(testUrl, {  headers: { 'Authorization': `Bearer ${idToken}`
      }
    });
    expect(apiResponse.status()).toBe(200);
  })

  test('Invalid search query to verify data returns on UI and API response status 400', async ({ page, request }) => {
    await SearchAttribute(page, attributeFileSize.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, "eq");
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, `'${attributeFileSize.value}'`);
    await page.waitForTimeout(2000);
    await page.getByTestId('adv-search-button').click();
    //Verification of warning message
    await page.locator(fssSearchPageObjectsConfig.dialogTitleSelector).textContent() === fssSearchPageObjectsConfig.warningMessageValue;
    //Search Query String
    const queryString = `${attributeFileSize.key} eq '${attributeFileSize.value}'`;
    const testUrl = `${autoTestConfig.apiurl}/batch?$filter=${queryString}`;    
    //Get operation   
    const apiResponse = await request.get(testUrl, { headers: { 'Authorization': `Bearer ${idToken}`
      }
    });
    expect(apiResponse.status()).toBe(400);
  })
})
