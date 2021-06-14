import { Browser, BrowserContext, chromium, Page } from 'playwright';
const { autoTestConfig } = require('./appSetting');
const {pageObjectsConfig} = require('./pageObjects');

describe('Test Home Page Scenario', () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch();
        context = await browser.newContext();
        page = await context.newPage();
    })

    beforeEach(async () => {
        await page.goto(autoTestConfig.url)
    })

    afterAll(async () => {
       await page.close()
       await context.close()
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
        expect(await page.innerText(pageObjectsConfig.accessibilitypagetitleSelector)).toContain(pageObjectsConfig.accessibilitypagetitleText);
        expect(page.url()).toContain("accessibility");

    })

    test('Does it navigate to accessibility page once click on Privacy policy link', async () => {
        await page.click(pageObjectsConfig.privacypolicylinkSelector);
        expect(await page.innerText(pageObjectsConfig.privacypolicypagetitleSelector)).toContain(pageObjectsConfig.privacypolicypagetitleText);
        expect(page.url()).toContain("cookie-policy");
    })

    test('Does it navigate to marine data portal page once click on marine data portal link', async () => {
        await page.click(pageObjectsConfig.marinedataportallinkSelector);
        expect(await page.innerText(pageObjectsConfig.marinedataportalpageSelector)).toContain(pageObjectsConfig.marinedataportalpageText);
        expect(page.url()).toContain("marine-data-portal");
    }) 

    test('Does it open new window once click on feedback link', async () => {
        page.click(pageObjectsConfig.feebacklinkSelector)    
        context.on('page', async page => {
            await page.waitForLoadState();
            expect(page.url()).toEqual(pageObjectsConfig.feebackUrl);
          })       
    })

    test('Does it navigate to admiralty home page once click on UK Hydrographic office link', async () => {
        await page.click(pageObjectsConfig.ukhydrographiclinkSelector);
        expect(await page.getAttribute(pageObjectsConfig.ukhydrographicpageSelector,"title")).toEqual(pageObjectsConfig.ukhydrographicpageTitle);
        expect(page.url()).toEqual(pageObjectsConfig.ukhydrographicpageUrl);

    })

})
