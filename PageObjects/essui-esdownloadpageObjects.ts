import { Page, Locator, expect } from "@playwright/test";


export class EsDownloadPageObjects {

    readonly expect: EsDownloadPageAssertions;
    readonly selectAllSelector: Locator;
    readonly requestENCsSelector: Locator;
    readonly downloadTextSelector: Locator;
    readonly downloadButtonSelector: Locator;
    readonly spinnerSelector: Locator;
    readonly includedENCsCountSelector: Locator;
    readonly EstimatedESsizeSelector: Locator;
    readonly selectedTextSelector: Locator;
    readonly countInvalidENCsSelector: Locator;
    readonly invalidEncsSelector: Locator;
    readonly errorMessageSelector: Locator;

    constructor(readonly page: Page) {
        this.expect = new EsDownloadPageAssertions(this);
        this.selectAllSelector = this.page.locator("//a[text()='Select all']");
        this.requestENCsSelector = this.page.locator("ukho-button.requestEncBtn");
        this.downloadTextSelector = this.page.locator("//h3[text()='Exchange set download']");
        this.downloadButtonSelector = this.page.locator("ukho-button.btnDownload");
        this.spinnerSelector = this.page.locator("i.fas.fa-circle-notch.fa-spin");
        this.includedENCsCountSelector = this.page.locator("(//strong[@class='f21'][2])");
        this.EstimatedESsizeSelector = this.page.locator("//p[@class='f21']");
        this.selectedTextSelector = this.page.locator("div[id='contentArea'] strong:nth-child(1)");
        this.countInvalidENCsSelector = this.page.locator("div[class='exchangesetcontainer'] li");
        this.invalidEncsSelector = this.page.locator("div[id='contentArea'] li");
        this.errorMessageSelector = this.page.locator("text = There has been an error");
    }

    // async selectAllSelectorClick(): Promise<void> {
    //     await this.selectAllSelector.click();
    // }

    // async requestENCsSelectorClick(): Promise<void> {
    //     await this.requestENCsSelector.click();
    // }
}

class EsDownloadPageAssertions {
    constructor(readonly esDownloadPageObjects: EsDownloadPageObjects) {
    }

    async spinnerSelectorVisible(): Promise<void> {

        expect(await this.esDownloadPageObjects.spinnerSelector.isVisible).toBeTruthy();
    }

    async spinnerSelectorHidden(): Promise<void> {

        expect(await this.esDownloadPageObjects.spinnerSelector.isVisible).toBeFalsy();
    }

    async downloadButtonSelectorEnabled(): Promise<void> {

        expect(await this.esDownloadPageObjects.downloadButtonSelector.isVisible).toBeTruthy();
    }

    async selectedTextSelectorVisible(): Promise<void> {

        expect(await this.esDownloadPageObjects.selectedTextSelector).toBeTruthy();
    }

    async includedENCsCountSelectorVisible(): Promise<void> {

        expect(await this.esDownloadPageObjects.includedENCsCountSelector).toBeTruthy();
    }

    async errorMessageSelectorDisplayed(): Promise<void> {

        expect(await this.esDownloadPageObjects.errorMessageSelector.innerText()).toBeTruthy();
    }

    async VerifyExchangeSetSize(): Promise<void> {

        let ENCsIncluded = parseInt(((await this.esDownloadPageObjects.includedENCsCountSelector.innerHTML()).split(' '))[0]);
        console.log(ENCsIncluded, "Included");
        console.log(await this.esDownloadPageObjects.EstimatedESsizeSelector.innerText(),"Innettext");
        console.log((ENCsIncluded * 0.3), "multi");

        if (ENCsIncluded < 4) {
            expect(await this.esDownloadPageObjects.EstimatedESsizeSelector.innerText()).toEqual('Estimated size ' + Math.round(ENCsIncluded * (0.3) * 1024) + 'KB');
        }
        else {
            expect(await this.esDownloadPageObjects.EstimatedESsizeSelector.innerText()).toEqual('Estimated size ' + (ENCsIncluded * 0.3) + 'MB');
           
        }

    }

    async ValidateInvalidENCsAsPerCount(): Promise<void> {

        let invalidEncsCount = await this.esDownloadPageObjects.countInvalidENCsSelector.count();
        let inValidEncs = await this.esDownloadPageObjects.invalidEncsSelector;

        for (var i = 1; i <= invalidEncsCount; i++) {

            expect(await inValidEncs.nth(i).innerText).toBeTruthy();
        }
    }
}