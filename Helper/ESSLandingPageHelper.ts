import {Page, expect} from '@playwright/test';
import {esslandingpageObjectsConfig} from '../PageObjects/essui-landingpageObjects.json';
import {fssHomePageObjectsConfig} from '../PageObjects/fss-homepageObjects.json'


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