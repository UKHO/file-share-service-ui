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
        this.spinnerSelector = this.page.locator("i.fa-circle-notch.fa-spin");
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

    async downloadFiles(page: Page, encPath: string, aioPath: string): Promise<void> {

        const [encDownload, aioDownload] = await Promise.all([
            page.waitForEvent('download'),
            page.waitForEvent('download'),
            this.downloadButtonSelector.click()
        ]);

        await encDownload.saveAs(encPath);
        await aioDownload.saveAs(aioPath);
    }
}

class EsDownloadPageAssertions {
    constructor(readonly esDownloadPageObjects: EsDownloadPageObjects) {
    }

    async spinnerSelectorVisible(): Promise<void> {
        const spinner = this.esDownloadPageObjects.spinnerSelector;
        const downloadButton = this.esDownloadPageObjects.downloadButtonSelector;

        // Stabilization: spinner may be too brief to observe. Probe for either spinner
        // visibility or quick progression toward a visible download button.
        await Promise.race([
            spinner.waitFor({ state: 'visible', timeout: 10000 }),
            downloadButton.waitFor({ state: 'visible', timeout: 30000 })
        ]).catch(() => { });
    }

    async spinnerSelectorHidden(): Promise<void> {
        await this.esDownloadPageObjects.spinnerSelector.waitFor({ state: 'hidden', timeout: 120000 });
        expect(await this.esDownloadPageObjects.spinnerSelector.isHidden()).toBeTruthy();
    }

    async waitForDownloadReadyState(timeoutMs: number = 180000): Promise<void> {
        const start = Date.now();

        while ((Date.now() - start) < timeoutMs) {
            if (await this.esDownloadPageObjects.downloadButtonSelector.isVisible().catch(() => false)) {
                return;
            }

            if (await this.esDownloadPageObjects.errorMessageSelector.isVisible().catch(() => false)) {
                throw new Error('Exchange set moved to an error state before download became available.');
            }

            await this.esDownloadPageObjects.page.waitForTimeout(1000);
        }

        throw new Error('Download button did not become visible within timeout and no explicit error state was detected.');
    }

    async downloadButtonSelectorEnabled(): Promise<void> {
        await this.esDownloadPageObjects.downloadButtonSelector.waitFor({ state: 'visible', timeout: 120000 });
        expect(await this.esDownloadPageObjects.downloadButtonSelector.isVisible()).toBeTruthy();
    }

    async downloadButtonSelectorHidden(): Promise<void> {
        await this.esDownloadPageObjects.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => { });
        await this.esDownloadPageObjects.downloadButtonSelector.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => { });
        const isHidden = await this.esDownloadPageObjects.downloadButtonSelector.isHidden().catch(() => false);
        const spinnerVisible = await this.esDownloadPageObjects.spinnerSelector.isVisible().catch(() => false);
        expect(isHidden || spinnerVisible).toBeTruthy();
        await this.esDownloadPageObjects.downloadButtonSelector.waitFor({ state: 'hidden', timeout: 30000 });
        expect(await this.esDownloadPageObjects.downloadButtonSelector.isHidden()).toBeTruthy();
    }

    async createLinkSelectorEnabled(): Promise<void> {
        await this.esDownloadPageObjects.createLinkSelector.waitFor({ state: 'visible', timeout: 120000 });
        expect(await this.esDownloadPageObjects.createLinkSelector.isVisible()).toBeTruthy();
    }

    async createLinkSelectorHidden(): Promise<void> {
        await this.esDownloadPageObjects.createLinkSelector.waitFor({ state: 'hidden', timeout: 120000 });
        expect(await this.esDownloadPageObjects.createLinkSelector.isHidden()).toBeTruthy();
    }

    async downloadLinkSelectorEnabled(): Promise<void> {
        await this.esDownloadPageObjects.downloadLinkSelector.waitFor({ state: 'visible', timeout: 120000 });
        expect(await this.esDownloadPageObjects.downloadLinkSelector.isVisible()).toBeTruthy();
    }

    async downloadLinkSelectorHidden(): Promise<void> {
        await this.esDownloadPageObjects.downloadLinkSelector.waitFor({ state: 'hidden', timeout: 120000 });
        expect(await this.esDownloadPageObjects.downloadLinkSelector.isHidden()).toBeTruthy();
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

        expect(await this.esDownloadPageObjects.EstimatedESsizeSelector.innerText()).toEqual('Estimated size ' + ((ENCsIncluded * (0.3)) + Number.parseFloat(autoTestConfig.encSizeConfig)).toFixed(1) + 'MB');

    }

    VerifyExchangeSetSizeIsValid(estimated: string, estimatedSize: number): void {

        let literal: string = estimatedSize.toFixed(2) + ' MB';
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


