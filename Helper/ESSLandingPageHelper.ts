import { Page } from '@playwright/test';
import { esslandingpageObjectsConfig } from '../PageObjects/essui-landingpageObjects.json';
import {encselectionpageObjectsConfig} from '..//PageObjects//essui-encselectionpageObjects.json'

//<summary>
// Uploading .csv & .txt files
//</summary>
//<param> page Object </param>
//<param> Element Locator </param>
//<param> File path </param>
export async function uploadFile(page: Page, elementSelector: string, filePath: string) {

  const [fileChooserDataFile] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.locator(elementSelector).click(),
  ]);
  await fileChooserDataFile.setFiles(filePath);
}

//<summary>
// Adding single ENcs
//</summary>
//<param> page Object </param>
//<param> Element Locator </param>
export async function addSingleENC(page: Page, elementSelector: string) {
  await page.click(esslandingpageObjectsConfig.addencradiobtnSelector);
  await page.fill(elementSelector, esslandingpageObjectsConfig.ENCValue2);
  await page.click(esslandingpageObjectsConfig.proceedButtonSelector);

}

//<summary>
// Adding Another ENcs
//</summary>
//<param> page Object </param>
//<param> Element Locator </param>
export async function addAnotherENC(page: Page, elementSelector: string) {
  await page.locator(encselectionpageObjectsConfig.addAnotherENCSelector).click(); 
  await page.locator(encselectionpageObjectsConfig.typeENCCellNameHereSelector).fill(esslandingpageObjectsConfig.ENCValue1);
  await page.locator(esslandingpageObjectsConfig.addsingleencSelector).click();

}