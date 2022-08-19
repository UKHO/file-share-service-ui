import {Page} from '@playwright/test';


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