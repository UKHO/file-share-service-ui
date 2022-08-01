import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y} from 'axe-playwright'
import { AcceptCookies,LoginPortal } from '../../Helper/CommonHelper';
import { fssSearchPageObjectsConfig } from '../../PageObjects/fss-searchpageObjects.json';
import { commonObjectsConfig } from '../../PageObjects/commonObjects.json';
import { attributeProductType} from '../../Helper/ConstantHelper';
import { autoTestConfig } from '../../appSetting.json';

test.describe('FSS UI Simplified Search Page Accessibility Test Scenarios', () => {
  
  test.beforeEach(async ({page}) => {
    
    await page.goto(autoTestConfig.url)
    await AcceptCookies(page);
    await LoginPortal(page,autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
    await page.waitForSelector(fssSearchPageObjectsConfig.searchPageContainerHeaderSelector);         
    var simplifiedSearchBox= (await page.$$(fssSearchPageObjectsConfig.inputSimplifiedSearchBoxSelector)).length
    expect(simplifiedSearchBox).toEqual(1);  
    
  })    

  test('check a11y for the initial page load and axe run options', async ({page}) => {
    await injectAxe(page);
    await checkA11y(page, undefined, {
      axeOptions: {               
        runOnly: {         
          type: 'tag',
          values: ['wcag2aa'],
        },
      },
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  })

  test('check a11y for no search result html and axe run options', async ({page}) => {
    await page.click(fssSearchPageObjectsConfig.simplifiedSearchButtonSelector);
    await page.waitForSelector(fssSearchPageObjectsConfig.dialogWarningSelector);
    await injectAxe(page);
    await checkA11y(page, undefined, {
      axeOptions: {               
        runOnly: {         
          type: 'tag',
          values: ['wcag2aa'],
        },
      },
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  })

  test('check a11y for simplified search result html and axe run options', async ({page}) => {
    await page.fill(fssSearchPageObjectsConfig.inputSimplifiedSearchBoxSelector, attributeProductType.value);
    await page.click(fssSearchPageObjectsConfig.simplifiedSearchButtonSelector);
    await page.waitForSelector(fssSearchPageObjectsConfig.searchResultTableSelector);
    await injectAxe(page);
    await checkA11y(page, undefined, {
      axeOptions: {               
        runOnly: {         
          type: 'tag',
          values: ['wcag2aa'],
        },
      },
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  })   
}) 