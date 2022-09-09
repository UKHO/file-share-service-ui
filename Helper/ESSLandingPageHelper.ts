import { Page } from '@playwright/test';
import { esslandingpageObjects } from '../PageObjects/essui-landingpageObjects';
import {encselectionpageObjectsConfig} from '..//PageObjects//essui-encselectionpageObjects.json'


//<summary>
// Adding single ENcs
//</summary>
//<param> page Object </param>
//<param> Element Locator </param>
export async function addSingleENC(page: Page, elementSelector: string) {
  await page.click(esslandingpageObjects.addencradiobtnSelector);
  await page.fill(elementSelector, esslandingpageObjects.ENCValue2);
  await page.click(esslandingpageObjects.proceedButtonSelector);

}

//<summary>
// Adding Another ENcs
//</summary>
//<param> page Object </param>
//<param> Element Locator </param>
export async function addAnotherENC(page: Page, elementSelector: string) {
  await page.locator(elementSelector).click(); 
  await page.locator(encselectionpageObjectsConfig.typeENCTextBoxSelector).fill(esslandingpageObjects.ENCValue1);
  await page.locator(esslandingpageObjects.addsingleencSelector).click();

}