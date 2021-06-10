import { Browser, BrowserContext, chromium, Page } from 'playwright';
const { autoTestConfig } = require('./appSetting');

describe('Launch Browser', () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch();
        context = await browser.newContext();
        page = await context.newPage();
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

})
