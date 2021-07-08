import { Browser, BrowserContext, chromium, Page } from 'playwright';
const { autoTestConfig } = require('./appSetting');
const { pageObjectsConfig } = require('./pageObjects');

describe('Test Home Page Scenario', () => {
    jest.setTimeout(120000);
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
        expect(await page.innerText(pageObjectsConfig.homepageheaderSelector)).toEqual(pageObjectsConfig.homepageheaderText);

    })

    test('Does Search and Sign in link appear on header', async () => {
        expect(await page.innerText(pageObjectsConfig.searchlinkSelector)).toEqual(pageObjectsConfig.searchlinkText);
        expect(await page.innerText(pageObjectsConfig.signinlinkSelector)).toEqual(pageObjectsConfig.signinlinkText);

    })

    test('Does it navigate to accessibility page once click on Accessibility link', async () => {
        await page.click(pageObjectsConfig.accessibilitylinkSelector);
        context.on('page', async page => {
            await page.waitForLoadState();
            expect(page.url()).toContain("accessibility");
        })
    })

    test('Does it navigate to Privacy policy page once click on Privacy policy link', async () => {
        await page.click(pageObjectsConfig.privacypolicylinkSelector);
        context.on('page', async page => {
            await page.waitForLoadState();
            expect(page.url()).toContain("cookie-policy");
        })
    })

    test('Does it navigate to marine data portal page once click on marine data portal link', async () => {
        await page.click(pageObjectsConfig.marinedataportallinkSelector);
        expect(await page.getAttribute(pageObjectsConfig.ukhydrographicpageSelector, "title")).toEqual(pageObjectsConfig.ukhydrographicpageTitle);
        expect(await page.url()).toEqual(pageObjectsConfig.ukhydrographicpageUrl);
    })

    test('Does it navigate to Admiralty home page once click on UK Hydrographic Office link', async () => {
        await page.click(pageObjectsConfig.ukhydrographiclinkSelector);
        expect(await page.getAttribute(pageObjectsConfig.ukhydrographicpageSelector, "title")).toEqual(pageObjectsConfig.ukhydrographicpageTitle);
        expect(page.url()).toEqual(pageObjectsConfig.ukhydrographicpageUrl);

    })

})