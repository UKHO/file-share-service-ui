import { test, expect } from '@playwright/test';
import { esslandingpageObjectsConfig } from '../../PageObjects/essui-landingpageObjects.json';
import { fssHomePageObjectsConfig } from '../../PageObjects/fss-homepageObjects.json';
import { uploadFile, } from '../../Helper/ESSLandingPageHelper';
import { autoTestConfig } from '../../appSetting.json';
import { LoginPortal } from '../../Helper/CommonHelper';
import { commonObjectsConfig } from '../../PageObjects/commonObjects.json';
import { encselectionpageObjectsConfig } from '../../PageObjects/essui-encselectionpageObjects.json';
import { downloadpageObjectsConfig } from '../../PageObjects/essui-esdownloadpageObjects.json'

test.describe('ESS UI ES Download Page Functional Test Scenarios', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(autoTestConfig.url);
        await page.waitForLoadState('load');
        await LoginPortal(page, autoTestConfig.user, autoTestConfig.password, commonObjectsConfig.loginSignInLinkSelector);
        await page.locator(fssHomePageObjectsConfig.essLinkSelector).click();
        await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
        await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData/downloadValidAndInvalidENCs.csv');
        await page.click(esslandingpageObjectsConfig.proceedButtonSelector);
        await page.click(downloadpageObjectsConfig.selectAllSelector);
    })

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14092
    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14093
    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14094
    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14095
    test('Verify Estimated Size of ES & Spinner untill Download button appears', async ({ page }) => {
        await page.click(downloadpageObjectsConfig.requestENCsSelector);
        await expect(page.locator(downloadpageObjectsConfig.spinnerSelector)).toBeVisible();
        await page.waitForSelector(downloadpageObjectsConfig.downloadButtonSelector);
        await expect(page.locator(downloadpageObjectsConfig.spinnerSelector)).toBeHidden();
        await expect(page.locator(downloadpageObjectsConfig.downloadButtonSelector)).toBeVisible();

        let ENCsIncluded = parseInt(((await page.innerHTML(downloadpageObjectsConfig.includedENCsCountSelector)).split(' '))[0]);
        if (ENCsIncluded < 4) {
            await expect(page.locator(downloadpageObjectsConfig.EstimatedESsizeSelector)).toContainText('Estimated size ' + Math.round(ENCsIncluded * (0.3) * 1024) + 'KB');
        }
        else {
            await expect(page.locator(downloadpageObjectsConfig.EstimatedESsizeSelector)).toContainText('Estimated size ' + ENCsIncluded * (0.3) + 'MB');
        }

    })

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14101 (Response 400 --> NOT 200 - Getting Error Message)
    test ('400 scenario', async ({ page }) => {
        page.route('**/productData/productIdentifiers', async (route, request) => {
            await route.fulfill({
                status: 400,
                body: 'Bad Request - Mock Response edited'
            });
        });
        await page.click(downloadpageObjectsConfig.requestENCsSelector)
        expect(await page.isVisible(downloadpageObjectsConfig.errorMessageSelector)).toBeTruthy();

    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14101 (Response 403 --> NOT 200 - Getting  Error Message)
    test ('403 scenario', async ({ page }) => {
        page.route('**/productData/productIdentifiers', async (route, request) => {
            await route.fulfill({
                status: 403,
                body: 'Forbidden - Mock Response edited'
            });
        });
        await page.click(downloadpageObjectsConfig.requestENCsSelector)
        expect(await page.isVisible(downloadpageObjectsConfig.errorMessageSelector)).toBeTruthy();
    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14101 (Response 500 --> NOT 200 - Getting Error Message)
    test ('500 scenario', async ({ page }) => {
        page.route('**/productData/productIdentifiers', async (route, request) => {
            await route.fulfill({
                status: 500,
                body: 'Internal server Error - Mock Response edited'
            });
        });
        await page.click(downloadpageObjectsConfig.requestENCsSelector)
        expect(await page.isVisible(downloadpageObjectsConfig.errorMessageSelector)).toBeTruthy();
    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14129 (200 - OK)
    test ('200 Scenario', async ({ page }) => {
        await page.click(encselectionpageObjectsConfig.startAgainLinkSelector);
        await page.click(esslandingpageObjectsConfig.uploadradiobtnSelector);
        await uploadFile(page, esslandingpageObjectsConfig.chooseuploadfileSelector, './Tests/TestData/downloadValidENCs.csv');
        await page.click(esslandingpageObjectsConfig.proceedButtonSelector);
        await page.click(downloadpageObjectsConfig.selectAllSelector);
        
        page.route('**/productData/productIdentifiers', async (route, request) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    "_links": {
                        "exchangeSetBatchStatusUri": {
                            "href": "https://uatadmiralty.azure-api.net/fss-qa/batch/9a0e19b3-58a9-4768-9acb-d25781a6923c/status"
                        },
                        "exchangeSetBatchDetailsUri": {
                            "href": "https://uatadmiralty.azure-api.net/fss-qa/batch/9a0e19b3-58a9-4768-9acb-d25781a6923c"
                        },
                        "exchangeSetFileUri": {
                            "href": "https://uatadmiralty.azure-api.net/fss-qa/batch/9a0e19b3-58a9-4768-9acb-d25781a6923c/files/V01X01.zip"
                        }
                    },
                    "exchangeSetUrlExpiryDateTime": "2022-09-15T11:42:26.271Z",
                    "requestedProductCount": 13,
                    "exchangeSetCellCount": 13,
                    "requestedProductsAlreadyUpToDateCount": 0,
                    "requestedProductsNotInExchangeSet": []
                })
            });
        })
        await page.click(downloadpageObjectsConfig.requestENCsSelector);
        await page.waitForSelector(downloadpageObjectsConfig.downloadButtonSelector);
        expect(await page.isVisible(downloadpageObjectsConfig.downloadButtonSelector)).toBeTruthy();
        expect(await page.isVisible(downloadpageObjectsConfig.selectedTextSelector)).toBeTruthy(); // select
        expect(await page.isVisible(downloadpageObjectsConfig.includedENCsCountSelector)).toBeTruthy(); // include
    });

    // https://dev.azure.com/ukhocustomer/File-Share-Service/_workitems/edit/14130 (For 200 but exclude some ENCs)
    test ('200 Scenario but exclude some ENCs', async ({ page }) => {
        page.route('**/productData/productIdentifiers', async (route, request) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    "_links": {
                        "exchangeSetBatchStatusUri": {
                            "href": "https://uatadmiralty.azure-api.net/fss-qa/batch/098df5af-7f15-4a78-9734-3d47341a383f/status"
                        },
                        "exchangeSetBatchDetailsUri": {
                            "href": "https://uatadmiralty.azure-api.net/fss-qa/batch/098df5af-7f15-4a78-9734-3d47341a383f"
                        },
                        "exchangeSetFileUri": {
                            "href": "https://uatadmiralty.azure-api.net/fss-qa/batch/098df5af-7f15-4a78-9734-3d47341a383f/files/V01X01.zip"
                        }
                    },
                    "exchangeSetUrlExpiryDateTime": "2022-09-15T11:44:16.659Z",
                    "requestedProductCount": 18,
                    "exchangeSetCellCount": 15,
                    "requestedProductsAlreadyUpToDateCount": 0,
                    "requestedProductsNotInExchangeSet": [
                        {
                            "productName": "AU220150",
                            "reason": "invalidProduct"
                        },
                        {
                            "productName": "AU5PTL01",
                            "reason": "invalidProduct"
                        },
                        {
                            "productName": "CN484220",
                            "reason": "invalidProduct"
                        }
                    ]
                })
            });
        })
        await page.click(downloadpageObjectsConfig.requestENCsSelector);
        await page.waitForSelector(downloadpageObjectsConfig.downloadButtonSelector);
        expect(await page.isVisible(downloadpageObjectsConfig.downloadButtonSelector)).toBeTruthy();
        let count = await page.locator(downloadpageObjectsConfig.countInvalidENCsSelector).count();
        for (var i = 1; i <= count; i++) {
            expect(await page.isVisible("div[id='contentArea'] li:nth-child(" + i + ")")).toBeTruthy();
        }
        expect(await page.isVisible(downloadpageObjectsConfig.selectedTextSelector)).toBeTruthy();
        expect(await page.isVisible(downloadpageObjectsConfig.includedENCsCountSelector)).toBeTruthy();
    });
})