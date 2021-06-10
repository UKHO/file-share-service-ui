import { Browser, BrowserContext, chromium, Page } from 'playwright';
const { autoTestConfig } = require('./appSetting');

describe('Launch Browser', () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch({
            headless: false,
            channel: "chrome"
        });
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

    test('Does it contains search with text', async () => {
        await page.textContent('"Search"');
    })

    test('Aclick', async () => {
        await page.click('text="Accessibility"')
    })

    test('PPclick', async () => {
        await page.click('text="Privacy policy"')
    })

})
