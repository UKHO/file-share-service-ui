import { Browser, BrowserContext, chromium, Page } from 'playwright';
const { autoTestConfig } = require('./appSetting');
const {pageObjectsConfig} = require('./pageObjects');

describe('Test Home Page Scenario', () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch();
    })

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto(autoTestConfig.url)
    })

    afterEach(async () => {
        await page.close()
        await context.close()
    })

    afterAll(async () => {
       await browser.close()
    })

    test('Does it contains correct header text', async () => {
        expect(await page.innerText(pageObjectsConfig.homePageHeaderSelector)).toEqual(pageObjectsConfig.homePageHeaderText);
       
    })

    test('Does Search and Sign in link appear on header', async () => {
        expect(await page.innerText(pageObjectsConfig.searchLinkSelector)).toEqual(pageObjectsConfig.searchLinkText);
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
        expect(await page.innerText(pageObjectsConfig.marinedataportalPageSelector)).toContain(pageObjectsConfig.marinedataportalPageText);
        expect(page.url()).toContain("marine-data-portal");
    }) 

    test('Does it navigate to Admiralty home page once click on UK Hydrographic Office link', async () => {
        await page.click(pageObjectsConfig.ukhydrographicLinkSelector);
        expect(await page.getAttribute(pageObjectsConfig.ukhydrographicPageSelector,"title")).toEqual(pageObjectsConfig.ukhydrographicPageTitle);
        expect(page.url()).toEqual(pageObjectsConfig.ukhydrographicPageUrl);

    })

    test('Does it contains correct Copyright text', async () => {
        expect(await page.innerText(pageObjectsConfig.copyrightTextSelector)).toEqual("© Crown copyright " + new Date().getFullYear() + " UK Hydrographic Office");
       
    })

})