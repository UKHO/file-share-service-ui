import { BrowserContext, Page } from 'playwright';
import { AcceptCookies } from './helpermethod';
const { autoTestConfig } = require('./appSetting');
const { pageObjectsConfig, pageTimeOut } = require('./pageObjects');

describe('Test Home Page Scenario', () => {
    jest.setTimeout(pageTimeOut.timeOutInMilliSeconds);
    let context: BrowserContext;
    let page: Page;

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto(autoTestConfig.url)
        await AcceptCookies(page);
    })

    afterEach(async () => {
        await page.close()
        await context.close()
    })

    test('Does it contains correct header text', async () => {
        expect(await page.innerText(pageObjectsConfig.homePageHeaderSelector)).toEqual(pageObjectsConfig.homePageHeaderText);

    })

    test('Does Sign in link appear on header', async () => {
        expect(await page.innerText(pageObjectsConfig.signinLinkSelector)).toEqual(pageObjectsConfig.signinLinkText);
    })

    test('Does it navigate to accessibility page once click on Accessibility link', async () => {
        await page.click(pageObjectsConfig.accessibilityLinkSelector);
        context.on('page', async page => {
            await page.waitForLoadState();
            expect(page.url()).toContain("accessibility");
        })
    })

    test('Does it navigate to Privacy policy page once click on Privacy policy link', async () => {
        await page.click(pageObjectsConfig.privacypolicyLinkSelector);
        context.on('page', async page => {
            await page.waitForLoadState();
            expect(page.url()).toContain("cookie-policy");
        })
    })

    test('Does it navigate to marine data portal page once click on marine data portal link', async () => {
        await page.click(pageObjectsConfig.marinedataportalLinkSelector);
        page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
        expect(await page.url()).toEqual(pageObjectsConfig.ukhydrographicPageUrl);
    })

    test('Does it navigate to Admiralty home page once click on UK Hydrographic Office link', async () => {
        await page.click(pageObjectsConfig.ukhydrographicLinkSelector);
        page.setDefaultTimeout(pageTimeOut.timeOutInMilliSeconds);
        expect(await page.innerText(pageObjectsConfig.ukhoFooterPageSelector)).toEqual(pageObjectsConfig.ukhoFooterTitle);
        expect(page.url()).toEqual(pageObjectsConfig.ukhoFooterUrl);
    })

    test('Does it contains correct Copyright text', async () => {
        expect(await page.innerText(pageObjectsConfig.copyrightTextSelector)).toEqual("© Crown copyright " + new Date().getFullYear() + " UK Hydrographic Office");

    })

    test('Does it contains correct body text', async () => {
        expect(await page.innerText(pageObjectsConfig.homePageBodySelector)).toEqual(pageObjectsConfig.homePageBodyText);

    })

})