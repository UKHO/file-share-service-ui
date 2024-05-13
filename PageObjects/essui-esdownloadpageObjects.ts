import { Page, Locator, expect } from "@playwright/test";
import { EncSelectionPageObjects, SelectedENCs } from "./essui-encselectionpageObjects";
import { autoTestConfig } from "../appSetting.json"
const fs = require('fs');
let filefound;
let filedeleted;

export class EsDownloadPageObjects {

    encselectionPageObjects: EncSelectionPageObjects;
    readonly expect: EsDownloadPageAssertions;
    readonly requestENCsSelector: Locator;
    readonly downloadButtonSelector: Locator;
    readonly exchangeSetDownloadFrame: Locator;
    readonly spinnerSelector: Locator;
    readonly exchangeSetDownloadFrame: Locator;
    readonly includedENCsCountSelector: Locator;
    readonly EstimatedESsizeSelector: Locator;
    readonly selectedTextSelector: Locator;
    readonly countInvalidENCsSelector: Locator;
    readonly invalidEncsSelector: Locator;
    readonly errorMessageSelector: Locator;
    readonly selectedENCsSelector: Locator;
    readonly getDialogueSelector: Locator;
    readonly downloadLinkSelector: Locator;
    readonly createLinkSelector: Locator;

    readonly pageUnderTest: Page

    constructor(readonly page: Page) {
        this.expect = new EsDownloadPageAssertions(this);
        this.encselectionPageObjects = new EncSelectionPageObjects(page);
        this.downloadButtonSelector = this.page.locator("//button[@type='submit']");
        this.spinnerSelector = this.page.locator("i.fas.fa-circle-notch.fa-spin");
        this.includedENCsCountSelector = this.page.locator("(//strong[@class='f21'][2])");
        this.EstimatedESsizeSelector = this.page.locator("//p[@class='f21']");
        this.selectedTextSelector = this.page.locator("div[id='contentArea'] strong:nth-child(1)");
        this.invalidEncsSelector = this.page.locator("(//div[@class='warningMsg'])");
        this.errorMessageSelector = this.page.getByText("There has been an error");
        this.selectedENCsSelector = this.page.locator('strong').filter({ hasText: ' ENCs selected' });
        this.getDialogueSelector = this.page.locator(("admiralty-dialogue"));
        this.downloadLinkSelector = this.page.getByTestId('download-exs');
        this.createLinkSelector = this.page.getByTestId('create-exs');
        this.exchangeSetDownloadFrame = this.page.locator("div[class = 'ess-container']> div");
        this.pageUnderTest = page;      

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

    async downloadButtonSelectorHidden(): Promise<void> {
        this.esDownloadPageObjects.page.waitForTimeout(3000);
      expect(await this.esDownloadPageObjects.downloadButtonSelector.isHidden).toBeTruthy();
    }

    async createLinkSelectorEnabled(): Promise<void> {

        expect(await this.esDownloadPageObjects.createLinkSelector.isVisible).toBeTruthy();
    }

    async createLinkSelectorHidden(): Promise<void> {

      expect(await this.esDownloadPageObjects.createLinkSelector.isHidden).toBeTruthy();
    }

    async downloadLinkSelectorEnabled(): Promise<void> {

      expect(await this.esDownloadPageObjects.downloadLinkSelector.isVisible).toBeTruthy();
    }

    async downloadLinkSelectorHidden(): Promise<void> {

      expect(await this.esDownloadPageObjects.downloadLinkSelector.isHidden).toBeTruthy();
    }

    async selectedTextSelectorVisible(): Promise<void> {

        expect(await this.esDownloadPageObjects.selectedTextSelector).toBeTruthy();
    }

    async includedENCsCountSelectorVisible(): Promise<void> {

        expect(await this.esDownloadPageObjects.includedENCsCountSelector).toBeTruthy();
    }

    async errorMessageSelectorDisplayed(): Promise<void> {
      expect(this.esDownloadPageObjects.getDialogueSelector).toBeTruthy();
      expect(this.esDownloadPageObjects.errorMessageSelector).toBeTruthy();
    }

    async VerifyExchangeSetSize(): Promise<void> {

        let ENCsIncluded = parseInt(((await this.esDownloadPageObjects.includedENCsCountSelector.innerHTML()).split(' '))[0]);

        expect(await this.esDownloadPageObjects.EstimatedESsizeSelector.innerText()).toEqual('Estimated size ' + ((ENCsIncluded *(0.3))+Number.parseFloat( autoTestConfig.encSizeConfig)).toFixed(1) + 'MB');

    }

    VerifyExchangeSetSizeIsValid(estimated: string, estimatedSize: number): void {

        let literal: string = estimatedSize + ' MB';
        expect(estimated).toEqual(literal);
    }

  async ValidateInvalidENCsAsPerCount(InValidENCs: string[]): Promise<void> {
    
       const testPage = this.esDownloadPageObjects.pageUnderTest;
       expect(await this.esDownloadPageObjects.getDialogueSelector).toBeTruthy();
       expect(await testPage.getByText(InValidENCs[0] + ' - invalidProduct')).toBeTruthy();
       expect(await testPage.getByText(InValidENCs[1] + ' - invalidProduct')).toBeTruthy();
       expect(await testPage.getByText(InValidENCs[2] + ' - productWithdrawn')).toBeTruthy();
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

    async exchangeSetDownloadGridValidation(): Promise<void> {
        expect(await this.esDownloadPageObjects.exchangeSetDownloadFrame.count() == 1);
      }

    }


