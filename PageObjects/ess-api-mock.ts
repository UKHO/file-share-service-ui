import { Page } from "@playwright/test";


export const apiRoute400 = (page: Page) => page.route('**/productData/productIdentifiers', async (route, request) => {
    route.fulfill({
        status: 400,
        body: 'Bad Request - Mock Response edited'
    });
});

export const apiRoute403 = (page: Page) => page.route('**/productData/productIdentifiers', async (route, request) => {
    route.fulfill({
        status: 403,
        body: 'Forbidden - Mock Response edited'
    });
});

export const apiRoute500 = (page: Page) => page.route('**/productData/productIdentifiers', async (route, request) => {
    route.fulfill({
        status: 500,
        body: 'Internal server Error - Mock Response edited'
    });
});

export const apiRoute200 = (page: Page) => page.route('**/productData/productIdentifiers', async (route, request) => {
    route.fulfill({
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




});

export const apiRoute200WithExcludedENCs = (page: Page) => page.route('**/productData/productIdentifiers', async (route, request) => {
    route.fulfill({
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
});


