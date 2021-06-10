// Needs to be higher than the default Playwright timeout
jest.setTimeout(40 * 1000)
import { Browser, BrowserContext, chromium, Page } from 'playwright';
const { autoTestConfig } = require('./appSetting');

//declare const page: Page;
describe('Launch Browser', () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch({
            channel: "chrome",
            headless: false
        })
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto(autoTestConfig.url)
    })

    afterAll(async () => {
        await page.close()
        await context.close()
        await browser.close()
    })

    // it("should navigate to admirality once you click on 'admirality'", async () => {
    //     await page.click("#a");
    //     expect(page.url()).toMatch('https://www.admiralty.co.uk/cookie-policy')
    // })

    test('Does it contains search with text', async () => {
        await page.textContent('"Search"');
    })

})
