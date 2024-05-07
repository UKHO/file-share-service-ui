import { test, expect } from '@playwright/test';
import { autoTestConfig } from '../../appSetting.json';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { AcceptCookies } from '../../Helper/CommonHelper';

test.describe('FSS UI Home Page Functional Test Scenarios', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(autoTestConfig.url);
        await page.waitForLoadState();
        await AcceptCookies(page);
    });

    test('Test to verify correct header text', async ({ page }) => {
        expect(await page.innerText(fssHomePageObjectsConfig.homePageHeaderSelector)).toEqual(fssHomePageObjectsConfig.homePageHeaderText);

    });

    test('Does Sign in link appear on header', async ({ page }) => {
        const profile = await page.locator(fssHomePageObjectsConfig.profileLinkSelector);
        expect(await profile.getByText(fssHomePageObjectsConfig.signinLinkText).isVisible)
    });

    test('Does it navigate to accessibility page once click on Accessibility link', async ({ page }) => {
        const lnk = await page.getByRole('link', { name: fssHomePageObjectsConfig.accessibilityLinkName });
        expect(lnk).not.toBeNull();
        await lnk.click()
        await page.waitForLoadState("networkidle");
        expect(page.url()).toContain("accessibility");
    })


    test('Does it navigate to Privacy policy page once click on Privacy policy link', async ({ page }) => {
        const lnk = await page.getByRole('link', { name: fssHomePageObjectsConfig.privacypolicyLinkName });
        expect(lnk).not.toBeNull();
        await lnk.click()
        await page.waitForLoadState("networkidle");
        expect(page.url()).toContain("cookie-policy");
    })

    test('Does it navigate to marine data portal page once click on marine data portal link', async ({ page }) => {
        const lnk = await page.getByRole('link', { name: fssHomePageObjectsConfig.marinedataportalLinkName });
        await lnk.click();
        await page.waitForLoadState("networkidle");
        expect(await page.url()).toEqual(fssHomePageObjectsConfig.ukhydrographicPageUrl);
    })

    test('Does it navigate to Admiralty home page once click on UK Hydrographic Office link', async ({ page }) => {
        await page.click(fssHomePageObjectsConfig.ukhydrographicLinkSelector);
        expect(await page.innerText(fssHomePageObjectsConfig.ukhoFooterPageSelector)).toEqual(fssHomePageObjectsConfig.ukhoFooterTitle);
        expect(page.url()).toEqual(fssHomePageObjectsConfig.ukhoFooterUrl);
    })

    test('Does it contains correct Copyright text', async ({ page }) => {
        expect(await page.innerText(fssHomePageObjectsConfig.copyrightTextSelector)).toEqual("© Crown copyright " + new Date().getFullYear() + " UK Hydrographic Office");

    })

    test('Does it contains correct body text', async ({ page }) => {
        expect(await page.innerText(fssHomePageObjectsConfig.homePageBodySelector)).toEqual(fssHomePageObjectsConfig.homePageBodyText);

    })
})
