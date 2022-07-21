import { test, expect } from '@playwright/test';
import { autoTestConfig } from '../../appSetting.json';
import { attributeBusinessUnit, attributeProductType, attributeFileSize} from '../../Helper/ConstantHelper';
import { SearchAttribute,ExpectAllResultsHaveBatchUserAttValue, ClickWaitRetry } from '../../Helper/SearchPageHelper';
import { AcceptCookies,LoginPortal } from '../../Helper/CommonHelper';
import { fssSearchPageObjectsConfig } from '../../PageObjects/fss-searchpageObjects.json';
import { commonObjectsConfig } from '../../PageObjects/commonObjects.json';

let idToken: string | null;
test.describe('FSS UI E2E Scenarios', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(autoTestConfig.url);
    await AcceptCookies(page);
    page.waitForNavigation();
    await LoginPortal(page, autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
    await page.waitForSelector(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector);
    expect(await page.innerHTML(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector))
      .toEqual(fssSearchPageObjectsConfig.searchPageContainerHeaderText);
    await page.click(fssSearchPageObjectsConfig.advancedSearchLinkSelector, { force: true });
    // Get the token from local storage once user logged in
    idToken = await page.evaluate(() => { return localStorage.getItem('idToken') });

  })

  test('Valid search system attributes query to verify data returns on UI and API response status 200', async ({ request, page }) => {
    await SearchAttribute(page, attributeBusinessUnit.key);
    await page.selectOption(fssSearchPageObjectsConfig.operatorDropDownSelector, "eq");
    await page.fill(fssSearchPageObjectsConfig.inputSearchValueSelector, attributeBusinessUnit.value);
    await ClickWaitRetry(page, fssSearchPageObjectsConfig.searchAttributeButton, fssSearchPageObjectsConfig.searchAttributeTable);
    // Verification of attribute table records
    const noOfRecods = (await page.$$(fssSearchPageObjectsConfig.searchAttributeTableRows)).length;
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
    await ClickWaitRetry(page, fssSearchPageObjectsConfig.searchAttributeButton, fssSearchPageObjectsConfig.searchAttributeTable);
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
    await ClickWaitRetry(page, fssSearchPageObjectsConfig.searchAttributeButton, fssSearchPageObjectsConfig.warningMessageSelector);
    //Verification of warning message
    const warningMessage = await page.innerText(fssSearchPageObjectsConfig.warningMessageSelector);
    expect(warningMessage).toContain(fssSearchPageObjectsConfig.warningMessageText);
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