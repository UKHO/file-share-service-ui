import {Page, expect} from '@playwright/test';
import {esslandingpageObjectsConfig} from '../PageObjects/essui-landingpageObjects.json';
import {fssHomePageObjectsConfig} from '../PageObjects/fss-homepageObjects.json'
import {autoTestConfig} from '../appSetting.json'

export async function navigateToESSLandingPage(page: Page): Promise<void>
{
    await page.locator(fssHomePageObjectsConfig.essLinkSelector).click();
}

export async function uploadfile(page: Page): Promise<void>
{
    await page.locator(esslandingpageObjectsConfig.uploadradiobtnSelector).click();   
}

export async function addENCnumbers(page: Page): Promise<void>
{
    await page.locator(esslandingpageObjectsConfig.addencradiobtnSelector).click();
}

export async function uploadValidCSVFile(page: Page): Promise<void>
{
  await page.click(esslandingpageObjectsConfig.radioButtonNameSelector);
  await page.setInputFiles(esslandingpageObjectsConfig.chooseuploadfileSelector,autoTestConfig.validENCsCSVFile);
  await page.click(esslandingpageObjectsConfig.chooseuploadfileproceedSelector);
}

export async function uploadValidTXTFile(page: Page): Promise<void>
{
  await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
  await page.setInputFiles(esslandingpageObjectsConfig.chooseuploadfileoptionSelector,autoTestConfig.validENCsTXTFile);
  await page.click(esslandingpageObjectsConfig.chooseuploadfileproceedSelector);
}

export async function uploadFileOtherThanCSVorTXT(page: Page): Promise<void>
{
  await page.click(esslandingpageObjectsConfig.radioButtonNameSelector);
  await page.setInputFiles(esslandingpageObjectsConfig.chooseuploadfileSelector,autoTestConfig.FileOtherThanCSVorTXT);
}

export async function uploadValidAndInvalidCSVFile(page: Page): Promise<void>
{
  await page.click(esslandingpageObjectsConfig.radioButtonNameSelector);
  await page.setInputFiles(esslandingpageObjectsConfig.chooseuploadfileSelector,autoTestConfig.validAndInvalidCSVFile);
  await page.click(esslandingpageObjectsConfig.chooseuploadfileproceedSelector);
}

export async function uploadvalidandInvalidTXTFile(page: Page): Promise<void>
{
  await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector); 
  await page.setInputFiles(esslandingpageObjectsConfig.chooseuploadfileoptionSelector,autoTestConfig.validAndInvalidTXTFile);
  await page.click(esslandingpageObjectsConfig.chooseuploadfileproceedSelector);
} 

export async function uploadValidAndDuplicateCSVFile(page: Page): Promise<void>
{
  await page.click(esslandingpageObjectsConfig.radioButtonNameSelector);
  await page.setInputFiles(esslandingpageObjectsConfig.chooseuploadfileSelector,autoTestConfig.validAndDuplicateCSVFile);
  await page.click(esslandingpageObjectsConfig.chooseuploadfileproceedSelector);
}

export async function uploadValidAndDuplicateTXTFile(page: Page): Promise<void>
{
  await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
  await page.setInputFiles(esslandingpageObjectsConfig.chooseuploadfileSelector, autoTestConfig.validAndDuplicateTXTFile);
  await page.click(esslandingpageObjectsConfig.chooseuploadfileproceedSelector);
}

