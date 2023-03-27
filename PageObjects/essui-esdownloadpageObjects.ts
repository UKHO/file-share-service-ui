import { Page, Locator, expect } from "@playwright/test";
import { EncSelectionPageObjects, SelectedENCs } from "./essui-encselectionpageObjects";
import { essConfig } from "../src/assets/config/appconfig.json"
const fs = require('fs');
let filefound;
let filedeleted;


export class EsDownloadPageObjects {

    encselectionPageObjects: EncSelectionPageObjects;
    readonly expect: EsDownloadPageAssertions;
    readonly requestENCsSelector: Locator;
    readonly downloadButtonSelector: Locator;
    readonly spinnerSelector: Locator;
    readonly includedENCsCountSelector: Locator;
    readonly EstimatedESsizeSelector: Locator;
    readonly selectedTextSelector: Locator;
    readonly countInvalidENCsSelector: Locator;
    readonly invalidEncsSelector: Locator;
    readonly errorMessageSelector: Locator;
    readonly selectedENCsSelector: Locator;

    constructor(readonly page: Page) {
        this.expect = new EsDownloadPageAssertions(this);
        this.encselectionPageObjects = new EncSelectionPageObjects(page)
        this.downloadButtonSelector = this.page.locator("//button[@type='submit']");
        this.spinnerSelector = this.page.locator("i.fas.fa-circle-notch.fa-spin");
        this.includedENCsCountSelector = this.page.locator("(//strong[@class='f21'][2])");
        this.EstimatedESsizeSelector = this.page.locator("//p[@class='f21']");
        this.selectedTextSelector = this.page.locator("div[id='contentArea'] strong:nth-child(1)");
        this.invalidEncsSelector = this.page.locator("(//div[@class='warningMsg'])");
        this.errorMessageSelector = this.page.locator("text = There has been an error");
        this.selectedENCsSelector = this.page.locator("(//div/strong)[1]");
    }

    async downloadFile(page: Page, path: string): Promise<void> {

        const [download] = await Promise.all([
            page.waitForEvent('download'),
            this.downloadButtonSelector.click()
        ]);

        await download.saveAs(path)
    }
}

class EsDownloadPageAssertions {
    constructor(readonly esDownloadPageObjects: EsDownloadPageObjects) {
    }

    async spinnerSelectorVisible(): Promise<void> {

        expect(await this.esDownloadPageObjects.spinnerSelector.isVisible).toBeTruthy();
    }

    async spinnerSelectorHidden(): Promise<void> {

        expect(await this.esDownloadPageObjects.spinnerSelector.isHidden).toBeTruthy();
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

        expect(await this.esDownloadPageObjects.EstimatedESsizeSelector.innerText()).toEqual('Estimated size ' + ((ENCsIncluded * Number.parseFloat(essConfig.avgSizeofENCinMB))+Number.parseFloat( essConfig.defaultEstimatedSizeinMB)).toFixed(1) + 'MB');

    }

    async ValidateInvalidENCsAsPerCount(InValidENCs: string[]): Promise<void> {

        for (var i = 0; i < 3; i++) {
            if (i < 2) {
                expect(await this.esDownloadPageObjects.invalidEncsSelector.nth(i).innerText()).toEqual(InValidENCs[i] + ' - invalidProduct');
            }
            else {
                expect(await this.esDownloadPageObjects.invalidEncsSelector.nth(i).innerText()).toEqual(InValidENCs[i] + ' - productWithdrawn');
            }
        }
    }

    async ValidateFileDownloaded(path: string): Promise<void> {

        if (fs.existsSync(path)) {
            filefound = true;
        }
        else {
            filefound = false;
        }
        expect(filefound).toBeTruthy();
    }

    async ValidateFiledeleted(path: string,): Promise<void> {
        // to delete the downloaded file
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
            filedeleted = true;
        }
        else {
            filedeleted = false;
        }
        expect(filedeleted).toBeTruthy();

        //to verify file has deleted successfully from the directory
        if (fs.existsSync(path)) {
            filedeleted = false;
        }
        else {
            filedeleted = true;
        }
        expect(filedeleted).toBeTruthy();

    }

    async SelectedENCs(): Promise<void> {
        expect(await this.esDownloadPageObjects.selectedENCsSelector).toBeVisible();
        expect(await this.esDownloadPageObjects.selectedENCsSelector.innerText()).toEqual(SelectedENCs+' ENCs selected');

    }
}

